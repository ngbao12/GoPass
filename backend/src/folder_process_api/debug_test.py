import traceback
import exam_processor_api
import json

# Temporarily patch the function to see the error
original_func = exam_processor_api.process_exam_file

def debug_process_exam_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print("Data loaded successfully")
        print("Number of passages:", len(data.get("passages", [])))
        print("Number of questions:", len(data.get("questions", [])))
        
        # Test mapping first passage
        if data.get("passages"):
            print("\nTesting passage mapping...")
            passage = exam_processor_api.map_passage_to_db_format(
                data["passages"][0], 
                "test-exam-id", 
                1
            )
            print("Passage mapped successfully:", passage["id"])
        
        # Test mapping first question
        if data.get("questions"):
            print("\nTesting question mapping...")
            question_data = data["questions"][0]
            print("Question data type:", type(question_data))
            print("Question keys:", list(question_data.keys()) if isinstance(question_data, dict) else "Not a dict")
            
            result = exam_processor_api.map_question_to_db_format(question_data, None)
            print("Question mapped successfully:", result["id"])
            
    except Exception as e:
        print("\nException occurred:")
        traceback.print_exc()

debug_process_exam_file('exam_corrected.json')
