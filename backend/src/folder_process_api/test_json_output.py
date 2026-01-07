"""
Test Node.js integration without actual PDF
Uses existing exam_corrected.json as sample data
"""
import sys
import json
import os

def test_json_output():
    """Test that JSON output works correctly for Node.js"""
    
    # Read existing processed exam data
    json_file = os.path.join(os.path.dirname(__file__), "exam_corrected.json")
    
    if not os.path.exists(json_file):
        print(json.dumps({
            "error": "exam_corrected.json not found"
        }, ensure_ascii=False))
        sys.exit(1)
    
    try:
        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        # Output to stdout (Node.js will capture this)
        print(json.dumps(data, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "type": type(e).__name__
        }, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    test_json_output()
