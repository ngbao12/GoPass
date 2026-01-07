"""
GoPass Exam Processor API Server
=================================
API server to process English exam JSON files and convert them to GoPass database format.

Author: GoPass Team
Date: 2026-01-07
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime
import uuid
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
CURRENT_USER_ID = "u_teacher_01"  # Default teacher user ID
SUBJECT = "Tiếng Anh"
POINTS_PER_QUESTION = 0.25
QUESTION_TYPE = "multiple_choice"


def generate_id(prefix=""):
    """Generate unique ID with optional prefix"""
    return f"{prefix}{uuid.uuid4().hex[:12]}"


def get_current_timestamp():
    """Get current timestamp in ISO format"""
    return datetime.now().isoformat() + "Z"


def determine_tags(question, passage_id):
    """
    Determine tags for question based on passage and content
    
    Rules:
    - If has passage: ["reading"]
    - If passage contains cloze markers (9), (10), etc: ["cloze", "reading"]
    - If no passage: []
    """
    tags = []
    
    if passage_id:
        # Check if it's a cloze passage (contains fill-in-the-blank markers)
        # Questions 9-13 typically are cloze questions
        question_num = question.get('question_number', 0)
        if 9 <= question_num <= 13:
            tags.append("cloze")
        
        tags.append("reading")
    
    return tags


def map_passage_to_db_format(passage, exam_id, order):
    """Map passage from exam_corrected.json to GoPass format"""
    passage_id = generate_id("passage-eng-")
    
    return {
        "id": passage_id,
        "examId": exam_id,
        "order": order,
        "title": passage.get("title", ""),
        "content": passage.get("content", ""),
        "createdAt": get_current_timestamp(),
        "updatedAt": get_current_timestamp()
    }


def map_question_to_db_format(question, passage_id=None):
    """Map question from exam_corrected.json to GoPass Question format"""
    question_id = generate_id("q-eng-")
    
    # Map options - handle both dict and array formats
    options = []
    question_options = question.get("options", {})
    
    if isinstance(question_options, dict):
        # Options are in format: {"A": "text", "B": "text", ...}
        for key, text in question_options.items():
            options.append({
                "id": key,
                "content": text,
                "isCorrect": key == question.get("answer", "")
            })
    elif isinstance(question_options, list):
        # Options are in format: [{"key": "A", "text": "..."}, ...]
        for opt in question_options:
            options.append({
                "id": opt.get("key", ""),
                "content": opt.get("text", ""),
                "isCorrect": opt.get("key", "") == question.get("answer", "")
            })
    
    # Determine tags
    tags = determine_tags(question, passage_id)
    
    return {
        "id": question_id,
        "type": QUESTION_TYPE,
        "content": question.get("question_text", question.get("question", "")),
        "options": options,
        "correctAnswer": question.get("answer", ""),
        "explanation": question.get("explanation", ""),
        "difficulty": "medium",  # Default difficulty
        "linkedPassageId": passage_id,
        "subject": SUBJECT,
        "points": POINTS_PER_QUESTION,
        "isPublic": True,
        "createdBy": CURRENT_USER_ID,
        "createdAt": get_current_timestamp(),
        "updatedAt": get_current_timestamp(),
        "tags": tags
    }


def map_exam_to_db_format(title, description, duration_minutes):
    """Map exam metadata to GoPass Exam format"""
    exam_id = generate_id("exam-eng-")
    
    return {
        "id": exam_id,
        "title": title,
        "description": description,
        "subject": SUBJECT,
        "gradeLevel": "12",  # Default for high school
        "duration": duration_minutes,
        "totalPoints": 10,  # Will be calculated based on questions
        "passingScore": 5,
        "instructions": "Đọc kỹ đề bài và chọn đáp án đúng nhất cho mỗi câu hỏi.",
        "isPublic": True,
        "isActive": True,
        "createdBy": CURRENT_USER_ID,
        "createdAt": get_current_timestamp(),
        "updatedAt": get_current_timestamp()
    }


def map_exam_question_to_db_format(exam_id, question_id, order, section, max_score):
    """Map ExamQuestion relationship"""
    return {
        "id": generate_id("eq-eng-"),
        "examId": exam_id,
        "questionId": question_id,
        "order": order,
        "section": section,
        "maxScore": max_score,
        "createdAt": get_current_timestamp(),
        "updatedAt": get_current_timestamp()
    }


def process_exam_file(file_path):
    """
    Process exam_corrected.json and convert to GoPass format
    
    Returns:
        dict: {
            "exam": Exam object,
            "passages": List of Passage objects,
            "questions": List of Question objects,
            "examQuestions": List of ExamQuestion relationships
        }
    """
    try:
        # Get absolute path relative to this script's directory
        if not os.path.isabs(file_path):
            script_dir = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(script_dir, file_path)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Create exam
        exam = map_exam_to_db_format(
            title="Đề Thi Thử Tiếng Anh THPT 2026",
            description="Đề thi thử môn Tiếng Anh theo cấu trúc mới nhất",
            duration_minutes=90
        )
        exam_id = exam["id"]
        
        # Process passages
        passages = []
        passage_map = {}  # Map passage_id (e.g., "passage_1") to generated ID
        
        for idx, passage_data in enumerate(data.get("passages", [])):
            passage = map_passage_to_db_format(passage_data, exam_id, idx + 1)
            passages.append(passage)
            # Map the original passage_id to the new generated ID
            original_passage_id = passage_data.get("passage_id", "")
            if original_passage_id:
                passage_map[original_passage_id] = passage["id"]
        
        # Process questions
        questions = []
        exam_questions = []
        question_order = 1
        
        for question_data in data.get("questions", []):
            # Determine which passage this question belongs to
            passage_id = None
            passage_related = question_data.get("PassageRelated")  # Note: capital P
            
            if passage_related and passage_related in passage_map:
                passage_id = passage_map[passage_related]
            
            # Map question
            question = map_question_to_db_format(question_data, passage_id)
            questions.append(question)
            
            # Create ExamQuestion relationship
            section = f"Câu {question_order}"
            exam_question = map_exam_question_to_db_format(
                exam_id,
                question["id"],
                question_order,
                section,
                POINTS_PER_QUESTION
            )
            exam_questions.append(exam_question)
            
            question_order += 1
        
        # Update exam totalPoints
        exam["totalPoints"] = len(questions) * POINTS_PER_QUESTION
        
        return {
            "success": True,
            "data": {
                "exam": exam,
                "passages": passages,
                "questions": questions,
                "examQuestions": exam_questions
            },
            "stats": {
                "totalQuestions": len(questions),
                "totalPassages": len(passages),
                "totalPoints": exam["totalPoints"],
                "questionsWithPassage": len([q for q in questions if q["linkedPassageId"]]),
                "questionsWithoutPassage": len([q for q in questions if not q["linkedPassageId"]]),
                "clozeQuestions": len([q for q in questions if "cloze" in q["tags"]]),
                "readingQuestions": len([q for q in questions if "reading" in q["tags"]])
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "GoPass Exam Processor API",
        "version": "1.0.0",
        "timestamp": get_current_timestamp()
    })


@app.route('/api/process-exam', methods=['POST'])
def process_exam():
    """
    Process exam file and return GoPass format
    
    Request Body:
        {
            "filePath": "path/to/exam_corrected.json",  # Optional, uses default if not provided
            "title": "Custom Exam Title",  # Optional
            "description": "Custom Description",  # Optional
            "duration": 90  # Optional, in minutes
        }
    
    Response:
        {
            "success": true,
            "data": {
                "exam": {...},
                "passages": [...],
                "questions": [...],
                "examQuestions": [...]
            },
            "stats": {...}
        }
    """
    try:
        # Get request data
        data = request.get_json() or {}
        
        # Get file path (use default if not provided)
        file_path = data.get('filePath', 'exam_corrected.json')
        
        # Check if file exists
        if not os.path.exists(file_path):
            # Try relative to script directory
            script_dir = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(script_dir, file_path)
        
        if not os.path.exists(file_path):
            return jsonify({
                "success": False,
                "error": f"File not found: {file_path}"
            }), 404
        
        # Process the exam file
        result = process_exam_file(file_path)
        
        # Save to output file if requested
        if data.get('saveToFile', False):
            output_path = data.get('outputPath', 'exam_processed_output.json')
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            result["outputPath"] = output_path
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/save-to-mock-db', methods=['POST'])
def save_to_mock_db():
    """
    Save processed exam to mock db.json file
    
    Request Body:
        {
            "filePath": "path/to/exam_corrected.json",
            "mockDbPath": "path/to/mock/db.json"  # Optional
        }
    """
    try:
        data = request.get_json() or {}
        
        # Process exam
        file_path = data.get('filePath', 'exam_corrected.json')
        result = process_exam_file(file_path)
        
        if not result["success"]:
            return jsonify(result), 400
        
        # Load mock db.json
        mock_db_path = data.get('mockDbPath', '../../frontend/mock/db.json')
        
        # Try to find the mock db file
        if not os.path.exists(mock_db_path):
            script_dir = os.path.dirname(os.path.abspath(__file__))
            mock_db_path = os.path.join(script_dir, mock_db_path)
        
        if not os.path.exists(mock_db_path):
            return jsonify({
                "success": False,
                "error": f"Mock database file not found: {mock_db_path}"
            }), 404
        
        # Load existing db
        with open(mock_db_path, 'r', encoding='utf-8') as f:
            db = json.load(f)
        
        # Append new data (don't replace existing data)
        processed_data = result["data"]
        
        # Add exam
        if "exams" not in db:
            db["exams"] = []
        db["exams"].append(processed_data["exam"])
        
        # Add passages (create array if doesn't exist)
        if "passages" not in db:
            db["passages"] = []
        db["passages"].extend(processed_data["passages"])
        
        # Add questions
        if "questions" not in db:
            db["questions"] = []
        db["questions"].extend(processed_data["questions"])
        
        # Add examQuestions
        if "examquestions" not in db:
            db["examquestions"] = []
        db["examquestions"].extend(processed_data["examQuestions"])
        
        # Save back to file
        with open(mock_db_path, 'w', encoding='utf-8') as f:
            json.dump(db, f, ensure_ascii=False, indent=2)
        
        return jsonify({
            "success": True,
            "message": "Data saved to mock database successfully",
            "mockDbPath": mock_db_path,
            "stats": result["stats"]
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/preview', methods=['POST'])
def preview_exam():
    """
    Preview processed exam without saving
    
    Request Body:
        {
            "filePath": "path/to/exam_corrected.json",
            "limit": 5  # Optional, limit number of questions to preview
        }
    """
    try:
        data = request.get_json() or {}
        file_path = data.get('filePath', 'exam_corrected.json')
        limit = data.get('limit', None)
        
        result = process_exam_file(file_path)
        
        if not result["success"]:
            return jsonify(result), 400
        
        # Limit questions if requested
        if limit:
            result["data"]["questions"] = result["data"]["questions"][:limit]
            result["data"]["examQuestions"] = result["data"]["examQuestions"][:limit]
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == '__main__':
    print("=" * 60)
    print("GoPass Exam Processor API Server")
    print("=" * 60)
    print(f"Server starting on http://localhost:5002")
    print(f"Current User ID: {CURRENT_USER_ID}")
    print(f"Subject: {SUBJECT}")
    print(f"Points per question: {POINTS_PER_QUESTION}")
    print("=" * 60)
    print("\nAvailable Endpoints:")
    print("  GET  /api/health              - Health check")
    print("  POST /api/process-exam        - Process exam file")
    print("  POST /api/save-to-mock-db     - Save to mock db.json")
    print("  POST /api/preview             - Preview processed exam")
    print("=" * 60)
    print("\nPress Ctrl+C to stop the server\n")
    
    app.run(debug=True, host='0.0.0.0', port=5002)
