import exam_processor_api
import json

result = exam_processor_api.process_exam_file('exam_corrected.json')

if result.get('success'):
    data = result['data']
    exam = data['exam']
    questions = data['questions']
    exam_questions = data['examQuestions']
    
    print("=" * 60)
    print("EXAM STRUCTURE CHECK")
    print("=" * 60)
    print(f"\n✅ Exam Keys: {list(exam.keys())}")
    print(f"✅ Duration: {exam.get('durationMinutes')} minutes")
    print(f"✅ Total Passages (embedded): {len(exam.get('readingPassages', []))}")
    print(f"✅ Total Questions: {exam.get('totalQuestions')}")
    print(f"✅ Total Points: {exam.get('totalPoints')}")
    
    print("\n" + "=" * 60)
    print("READING PASSAGES CHECK")
    print("=" * 60)
    for i, passage in enumerate(exam.get('readingPassages', [])[:3], 1):
        print(f"\nPassage {i}:")
        print(f"  ID: {passage.get('id')}")
        print(f"  Title: {passage.get('title')[:50]}...")
    
    print("\n" + "=" * 60)
    print("QUESTIONS WITH TAGS CHECK")
    print("=" * 60)
    
    # Check questions with tags
    for i in [6, 7, 8, 9, 10]:  # Questions 7-11 (0-indexed: 6-10)
        q = questions[i]
        eq = exam_questions[i]
        print(f"\nQuestion {i+1}:")
        print(f"  Tags: {q.get('tags')}")
        print(f"  LinkedPassage: {q.get('linkedPassageId')}")
        print(f"  Section: {eq.get('section')}")
    
    print("\n" + "=" * 60)
    print("SECTION DISTRIBUTION")
    print("=" * 60)
    sections = {}
    for eq in exam_questions:
        section = eq.get('section', 'Unknown')
        sections[section] = sections.get(section, 0) + 1
    
    for section, count in sections.items():
        print(f"  {section}: {count} questions")
    
    print("\n" + "=" * 60)
    print("SAVE OUTPUT TO FILE")
    print("=" * 60)
    
    with open('exam_processed_output.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print("✅ Saved to: exam_processed_output.json")
    
else:
    print("❌ Error:", result.get('error'))
