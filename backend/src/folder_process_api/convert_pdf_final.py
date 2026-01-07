"""
PDF to JSON Exam Converter - Final Version
Converts English exam PDF to structured JSON with proper HTML formatting
"""
import pdfplumber
import re
import json

def clean_text(text):
    """Remove watermarks and normalize spaces"""
    if not text:
        return ""
    text = re.sub(r'TAILIEUDIEUKY\s*©\s*2025', '', text)
    # Normalize spaces but preserve newlines
    text = re.sub(r'[ \t]+', ' ', text)  # Multiple spaces/tabs -> single space
    text = re.sub(r' *\n *', '\n', text)  # Remove spaces around newlines
    text = re.sub(r'\n{3,}', '\n\n', text)  # Max 2 consecutive newlines
    return text.strip()

def extract_with_bold(page):
    """Extract text with <b> tags for bold text"""
    chars = page.chars
    if not chars:
        return ""
    
    chars = sorted(chars, key=lambda x: (round(x['top'], 1), x['x0']))
    
    output = []
    is_bold = False
    prev_y = None
    
    for char in chars:
        y = round(char['top'], 1)
        
        # Detect line breaks
        if prev_y is not None:
            diff = abs(y - prev_y)
            if diff > 15:  # Paragraph
                if is_bold:
                    output.append("</b>")
                    is_bold = False
                output.append("\n\n")
            elif diff > 3:  # Line
                if is_bold:
                    output.append("</b>")
                    is_bold = False
                output.append("\n")
        
        prev_y = y
        
        # Check bold
        font = char.get('fontname', '').lower()
        char_bold = 'bold' in font or 'heavy' in font
        
        if char_bold and not is_bold:
            output.append("<b>")
            is_bold = True
        elif not char_bold and is_bold:
            output.append("</b>")
            is_bold = False
        
        output.append(char['text'])
    
    if is_bold:
        output.append("</b>")
    
    return "".join(output)

def balance_bold(text):
    """Fix bold tag issues"""
    if not text:
        return ""
    
    # Count tags
    open_c = text.count('<b>')
    close_c = text.count('</b>')
    
    # Balance
    if open_c > close_c:
        text += '</b>' * (open_c - close_c)
    elif close_c > open_c:
        text = '<b>' * (close_c - open_c) + text
    
    # Clean empty bold tags
    text = re.sub(r'<b>\s*</b>', '', text)
    text = re.sub(r'<b>(<b>)+', '<b>', text)
    text = re.sub(r'(</b>)+</b>', '</b>', text)
    
    # Only remove leading/trailing if they're orphaned (not paired)
    # Don't remove valid bold markup at start/end
    
    return text.strip()

def to_html_paragraphs(text):
    """Convert text to HTML <p> tags"""
    if not text:
        return ""
    
    paras = text.split('\n\n')
    result = []
    
    for p in paras:
        p = p.replace('\n', ' ')
        p = re.sub(r'\s+', ' ', p)
        p = balance_bold(p.strip())
        
        # Merge adjacent bold tags
        p = re.sub(r'</b>\s+<b>', ' ', p)
        
        if not p or len(p) < 5:
            continue
        
        # Citations
        if re.match(r'^\(?(Adapted|Source|By\s)', p, re.I):
            result.append(f'<p class="text-right italic text-sm text-gray-500">{p}</p>')
        else:
            result.append(f'<p class="mb-4 text-justify">{p}</p>')
    
    return '\n'.join(result)

def to_br_lines(text):
    """Convert text to <br> separated lines for questions"""
    if not text:
        return ""
    
    lines = text.split('\n')
    result = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Check if new item (including a -, b -, etc.)
        pure = re.sub(r'<.*?>', '', line)
        is_new_item = re.match(r'^([a-e]\s*-|[A-D]\.|Question\s+\d+|\d+\.)', pure)
        
        # Always treat a-, b-, c- as new lines (for ordering questions)
        if is_new_item:
            result.append(line)
        elif not result:
            result.append(line)
        else:
            # Continue previous line
            result[-1] += ' ' + line
    
    text = '<br>'.join(result)
    text = balance_bold(text)
    
    # Clean up orphaned bold tags in middle
    text = re.sub(r'</b>\s*<b>', ' ', text)
    
    return text

def extract_exam(pdf_path):
    """Extract full exam from PDF"""
    
    # Read PDF
    full_text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = extract_with_bold(page)
            text = clean_text(text)
            full_text += text + "\n\n"
    
    # Split answers
    ans_match = re.search(r'Answers?\s*:', full_text, re.I)
    if ans_match:
        content = full_text[:ans_match.start()]
        ans_text = full_text[ans_match.start():]
    else:
        content = full_text
        ans_text = ""
    
    # Parse answers
    answers = {}
    for m in re.finditer(r'(\d+)\.\s*([A-D])', ans_text):
        answers[int(m.group(1))] = m.group(2)
    
    # Split by Question X. or Question X:
    parts = re.split(r'Question\s+(\d+)[\.:]', content, flags=re.I)
    
    passages = []
    questions = []
    current_pass = None
    pass_num = 0
    
    # Passage intro pattern
    pass_pat = r'Read\s+the\s+following\s+(?:leaflet|passage|advertisement|passage\s+about)[^\.]*\s+and\s+mark[^\.]+\.'
    
    # Before Q1
    if parts[0].strip():
        intro = parts[0].strip()
        m = re.search(pass_pat, intro, re.I | re.DOTALL)
        if m:
            pass_num += 1
            current_pass = f"passage_{pass_num}"
            passages.append({
                "passage_id": current_pass,
                "instruction": to_br_lines(m.group(0)),
                "parts": [intro[m.end():].strip()],
                "q_start": 1  # Default: starts from Q1
            })
    
    # Process questions
    i = 1
    while i < len(parts) - 1:
        q_num = int(parts[i])
        q_block = parts[i + 1].strip()
        
        # New passage?
        m = re.search(pass_pat, q_block, re.I | re.DOTALL)
        
        if m:
            # Before intro = question (no passage)
            before = q_block[:m.start()].strip()
            q_data = parse_question(q_num, before, answers, None)
            if q_data:
                questions.append(q_data)
            
            # New passage - starts from NEXT question
            pass_num += 1
            current_pass = f"passage_{pass_num}"
            after = q_block[m.end():].strip()
            
            passages.append({
                "passage_id": current_pass,
                "instruction": to_br_lines(m.group(0)),
                "parts": [after],
                "q_start": q_num + 1  # Passage starts from NEXT question
            })
        else:
            # Normal question
            # Find options start
            opt_match = re.search(r'\n\s*A\.\s+', q_block)
            
            if opt_match and current_pass:
                # Before options = passage content
                before = q_block[:opt_match.start()].strip()
                
                # Only add if substantial and not question stem
                if before and len(before) > 30:
                    if not re.match(r'^(Which|What|The\s+(word|phrase)|According|Where|In\s+which)', before, re.I):
                        for p in passages:
                            if p["passage_id"] == current_pass:
                                p["parts"].append(before)
                                break
            
            # Parse question
            q_data = parse_question(q_num, q_block, answers, current_pass)
            if q_data:
                questions.append(q_data)
        
        i += 2
    
    # Fix PassageRelated for last question of each passage
    # Build mapping of passage ranges
    pass_ranges = []
    for idx, p in enumerate(passages):
        q_start = p.get("q_start")
        if q_start:
            # Find q_end (start of next passage - 1, or last question)
            if idx + 1 < len(passages):
                q_end = passages[idx + 1].get("q_start", len(questions) + 1) - 1
            else:
                q_end = len(questions)
            pass_ranges.append((p["passage_id"], q_start, q_end))
    
    # Fix PassageRelated - ensure last question of each passage is correctly assigned
    # Build correct mapping: questions between passage N and passage N+1 belong to passage N
    # BUT: Only if the question has "cloze" or "reading" tags
    # Ordering questions (empty tags) should have PassageRelated = None
    for idx, (pass_id, q_start, q_end) in enumerate(pass_ranges):
        # For last passage, include all remaining questions with options
        if idx == len(pass_ranges) - 1:
            actual_end = max(q["question_number"] for q in questions if q["options"])
        else:
            # End is one question before next passage starts
            actual_end = pass_ranges[idx + 1][1] - 1
        
        # Apply to all questions in range
        for q in questions:
            if q_start <= q["question_number"] <= actual_end:
                if q["options"]:  # Has options
                    # Only set PassageRelated if question has tags (not ordering)
                    if q.get("tags"):
                        q["PassageRelated"] = pass_id
                    else:
                        q["PassageRelated"] = None
    
    # Finalize passages
    for p in passages:
        combined = '\n\n'.join(p["parts"])
        # Remove blanks (6) _____
        combined = re.sub(r'\([0-9]+\)\s*_{2,}[^\n]*', '', combined)
        p["content"] = to_html_paragraphs(combined)
        del p["parts"]
        if "q_start" in p:  # Safely remove q_start if exists
            del p["q_start"]
    
    print(f"✅ Extracted {len(passages)} passages, {len(questions)} questions")
    
    return {
        "passages": passages,
        "questions": questions
    }

def parse_question(q_num, text, answers, pass_id):
    """Parse question with options"""
    
    # Special handling for ordering questions (Q1-Q5)
    # These have a-, b-, c- as question parts, then A., B., C. as options
    # Look for uppercase A., B., C., D. pattern first
    # Try multiple patterns for bold format
    uppercase_bold1 = list(re.finditer(r'<b>\s*([A-D])\.\s*</b>', text))
    uppercase_bold2 = list(re.finditer(r'<b>([A-D])\.</b>', text))
    uppercase_space = list(re.finditer(r'(?:^|\s)([A-D])\.\s+', text))
    
    # Combine and sort by position
    all_uppercase = []
    for m in uppercase_bold1:
        all_uppercase.append(m)
    for m in uppercase_bold2:
        all_uppercase.append(m)
    for m in uppercase_space:
        all_uppercase.append(m)
    
    all_uppercase.sort(key=lambda m: m.start())
    
    # Filter uppercase options (should be near end of text)
    if all_uppercase:
        # Check if these are real options (appear after lowercase a-, b-, etc.)
        # For ordering questions, we need at least 3 lowercase items (a-, b-, c-)
        first_upper = all_uppercase[0].start()
        lowercase_items = re.findall(r'\b[a-e]\s*-', text[:first_upper])
        has_lowercase_before = len(lowercase_items) >= 3
        
        if has_lowercase_before and len(all_uppercase) >= 3:
            # This is an ordering question - no passage relation
            # Question text = everything before first uppercase option
            q_text = text[:first_upper].strip()
            
            # Extract uppercase options
            options = {}
            last_letter = None
            
            for idx, m in enumerate(all_uppercase):
                letter = m.group(1)
                
                if letter not in ['A', 'B', 'C', 'D'] or letter == last_letter:
                    continue
                
                last_letter = letter
                start = m.end()
                
                # Find end
                end = len(text)
                for j in range(idx + 1, len(all_uppercase)):
                    next_letter = all_uppercase[j].group(1)
                    if next_letter != letter and next_letter in ['A', 'B', 'C', 'D']:
                        end = all_uppercase[j].start()
                        break
                
                opt_text = text[start:end].strip()
                opt_text = clean_text(opt_text)
                opt_text = re.sub(r'</?b>\s*$', '', opt_text).strip()
                opt_text = re.sub(r'^\s*</?b>\s*', '', opt_text).strip()
                opt_text = re.sub(r'\s*[–-]\s*[a-e]\s*<b>\s*$', '', opt_text).strip()
                opt_text = re.sub(r'\n{2,}.*$', '', opt_text).strip()  # Remove double newlines and after
                
                options[letter] = opt_text
                if len(options) == 4:
                    break
            
            return {
                "question_number": q_num,
                "question_text": to_br_lines(q_text),
                "options": options,
                "answer": answers.get(q_num, ""),
                "PassageRelated": None,  # Ordering questions have no passage
                "tags": []  # Empty tags for ordering questions
            }
    
    # Regular question processing
    # Try finding options with various patterns
    # Pattern 1: A. on new line
    opts_newline = list(re.finditer(r'\n\s*([A-D])\.\s+', text))
    
    # Pattern 2: <b> A.</b> or <b>A.</b> inline (from bold formatting)
    opts_inline1 = list(re.finditer(r'<b>\s*([A-D])\.\s*</b>', text))
    opts_inline2 = list(re.finditer(r'<b>([A-D])\.</b>', text))
    
    # Pattern 3: Simple A. pattern
    opts_simple = list(re.finditer(r'\b([A-D])\.\s+', text))
    
    # Combine inline patterns
    opts_inline = opts_inline1 + opts_inline2
    opts_inline.sort(key=lambda m: m.start())
    
    # Use the pattern that finds the most options (prefer 4)
    opts = opts_newline
    if len(opts_inline) > len(opts):
        opts = opts_inline
    if len(opts_simple) == 4 and len(opts) < 4:
        opts = opts_simple
    
    if not opts or len(opts) < 3:
        # No valid options found
        return {
            "question_number": q_num,
            "question_text": to_br_lines(text),
            "options": {},
            "answer": answers.get(q_num, ""),
            "PassageRelated": pass_id,
            "tags": []
        }
    
    # Extract question text (before first option)
    q_text = text[:opts[0].start()].strip()
    
    # Determine question type by checking keywords
    tags = []
    
    # Strip bold tags for pattern matching
    q_text_plain = re.sub(r'</?b>', '', q_text)
    
    # Check for cloze test (fill in the blank with numbered blanks)
    if re.search(r'\(\s*\d+\s*\)\s*_{2,}', q_text_plain):
        tags.append("cloze")
    # Check for reading comprehension keywords
    elif re.search(r'(according to|which of the following|the word|the phrase|best summarises?|TRUE according|NOT mentioned|refers to|could be best replaced|best paraphrases?|in which paragraph|where in paragraph)', q_text_plain, re.I):
        tags.append("reading")
    
    # Extract options
    options = {}
    last_letter = None
    
    for idx, m in enumerate(opts):
        letter = m.group(1)
        
        # Skip if not A, B, C, or D
        if letter not in ['A', 'B', 'C', 'D']:
            continue
        
        # Skip duplicates
        if letter == last_letter:
            continue
        
        last_letter = letter
        
        start = m.end()
        
        # Find end (next option or end of text)
        end = len(text)
        for j in range(idx + 1, len(opts)):
            next_letter = opts[j].group(1)
            if next_letter != letter and next_letter in ['A', 'B', 'C', 'D']:
                end = opts[j].start()
                break
        
        opt_text = text[start:end].strip()
        opt_text = clean_text(opt_text)
        
        # Clean up trailing garbage (newlines, bold tags, spaces)
        # Remove everything after double newlines
        if '\n\n' in opt_text:
            opt_text = opt_text.split('\n\n')[0].strip()
        
        # Remove trailing bold tags and spaces
        opt_text = re.sub(r'(</?b>|\s)+$', '', opt_text).strip()
        opt_text = re.sub(r'^(</?b>|\s)+', '', opt_text).strip()
        
        # Remove trailing dashes
        opt_text = re.sub(r'\s*[–-]\s*[a-e]$', '', opt_text)
        
        # Stop if we found all 4 options
        options[letter] = opt_text
        if len(options) == 4:
            break
    
    return {
        "question_number": q_num,
        "question_text": to_br_lines(q_text),
        "options": options,
        "answer": answers.get(q_num, ""),
        "PassageRelated": pass_id,
        "tags": tags
    }

# Main
if __name__ == "__main__":
    import sys
    
    # Check if PDF path is provided as command line argument
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
    else:
        pdf_path = "de_tieng_anh.pdf"
    
    # Extract exam from PDF
    result = extract_exam(pdf_path)
    
    # Output JSON to stdout for Node.js to capture
    print(json.dumps(result, ensure_ascii=False))
