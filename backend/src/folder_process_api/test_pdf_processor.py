"""
Test script to verify PDF processing works correctly
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from convert_pdf_final import extract_exam
import json

def test_pdf_processing():
    """Test PDF processing with sample file"""
    
    # Test with sample PDF (if exists)
    test_pdf = "de_tieng_anh.pdf"
    
    if not os.path.exists(test_pdf):
        print(json.dumps({
            "error": f"Test PDF not found: {test_pdf}",
            "solution": "Place a test PDF file in the folder_process_api directory"
        }, ensure_ascii=False))
        return
    
    try:
        # Extract exam
        result = extract_exam(test_pdf)
        
        # Output statistics (not the full JSON)
        print(json.dumps({
            "success": True,
            "stats": {
                "passages": len(result.get("passages", [])),
                "questions": len(result.get("questions", [])),
                "sample_passage": result["passages"][0] if result.get("passages") else None,
                "sample_question": result["questions"][0] if result.get("questions") else None
            }
        }, ensure_ascii=False, indent=2))
        
    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "type": type(e).__name__
        }, ensure_ascii=False))

if __name__ == "__main__":
    test_pdf_processing()
