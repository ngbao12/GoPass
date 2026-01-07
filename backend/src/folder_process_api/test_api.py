"""
Test script for GoPass Exam Processor API
==========================================
This script demonstrates how to use the API endpoints to process exam files.
"""

import requests
import json

# API Configuration
API_BASE_URL = "http://localhost:5002/api"

def print_section(title):
    """Print formatted section header"""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70 + "\n")


def test_health_check():
    """Test 1: Health Check"""
    print_section("TEST 1: Health Check")
    
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        result = response.json()
        
        print("✅ Server is healthy!")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_preview_exam():
    """Test 2: Preview Processed Exam"""
    print_section("TEST 2: Preview Processed Exam (First 3 Questions)")
    
    try:
        payload = {
            "filePath": "exam_corrected.json",
            "limit": 3
        }
        
        response = requests.post(
            f"{API_BASE_URL}/preview",
            json=payload
        )
        result = response.json()
        
        if result.get("success"):
            print("✅ Preview successful!")
            print(f"\n📊 Statistics:")
            stats = result.get("stats", {})
            for key, value in stats.items():
                print(f"   {key}: {value}")
            
            print(f"\n📝 Sample Question (First):")
            if result["data"]["questions"]:
                q = result["data"]["questions"][0]
                print(f"   ID: {q['id']}")
                print(f"   Type: {q['type']}")
                print(f"   Content: {q['content'][:100]}...")
                print(f"   Tags: {q['tags']}")
                print(f"   Linked Passage: {q['linkedPassageId']}")
                print(f"   Options: {len(q['options'])} choices")
            
            return True
        else:
            print(f"❌ Error: {result.get('error')}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_process_and_save():
    """Test 3: Process and Save to JSON File"""
    print_section("TEST 3: Process and Save to JSON File")
    
    try:
        payload = {
            "filePath": "exam_corrected.json",
            "saveToFile": True,
            "outputPath": "exam_processed_output.json"
        }
        
        response = requests.post(
            f"{API_BASE_URL}/process-exam",
            json=payload
        )
        result = response.json()
        
        if result.get("success"):
            print("✅ Processing successful!")
            print(f"📁 Output saved to: {result.get('outputPath')}")
            
            stats = result.get("stats", {})
            print(f"\n📊 Processing Statistics:")
            print(f"   Total Questions: {stats.get('totalQuestions')}")
            print(f"   Total Passages: {stats.get('totalPassages')}")
            print(f"   Total Points: {stats.get('totalPoints')}")
            print(f"   Questions with Passage: {stats.get('questionsWithPassage')}")
            print(f"   Questions without Passage: {stats.get('questionsWithoutPassage')}")
            print(f"   Cloze Questions: {stats.get('clozeQuestions')}")
            print(f"   Reading Questions: {stats.get('readingQuestions')}")
            
            return True
        else:
            print(f"❌ Error: {result.get('error')}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_full_process():
    """Test 4: Full Processing"""
    print_section("TEST 4: Full Processing (All Data)")
    
    try:
        payload = {
            "filePath": "exam_corrected.json"
        }
        
        response = requests.post(
            f"{API_BASE_URL}/process-exam",
            json=payload
        )
        result = response.json()
        
        if result.get("success"):
            print("✅ Full processing successful!")
            
            data = result["data"]
            print(f"\n📦 Data Generated:")
            print(f"   Exam: {data['exam']['title']}")
            print(f"   Duration: {data['exam']['duration']} minutes")
            print(f"   Total Points: {data['exam']['totalPoints']}")
            print(f"   Passages: {len(data['passages'])}")
            print(f"   Questions: {len(data['questions'])}")
            print(f"   ExamQuestions: {len(data['examQuestions'])}")
            
            # Show tag distribution
            tag_counts = {}
            for q in data["questions"]:
                for tag in q["tags"]:
                    tag_counts[tag] = tag_counts.get(tag, 0) + 1
            
            if tag_counts:
                print(f"\n🏷️  Tag Distribution:")
                for tag, count in tag_counts.items():
                    print(f"   {tag}: {count} questions")
            
            return True
        else:
            print(f"❌ Error: {result.get('error')}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def run_all_tests():
    """Run all tests"""
    print("\n")
    print("🚀 " + "=" * 66)
    print("🚀  GoPass Exam Processor API - Test Suite")
    print("🚀 " + "=" * 66)
    
    tests = [
        ("Health Check", test_health_check),
        ("Preview Exam", test_preview_exam),
        ("Process and Save", test_process_and_save),
        ("Full Process", test_full_process)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            success = test_func()
            results.append((name, success))
        except Exception as e:
            print(f"\n❌ Test '{name}' failed with exception: {e}")
            results.append((name, False))
    
    # Print summary
    print_section("TEST SUMMARY")
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
    
    print(f"\n📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed successfully!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")


if __name__ == "__main__":
    print("\n⚠️  Make sure the API server is running on http://localhost:5002")
    print("   Run: python exam_processor_api.py")
    input("\nPress Enter to start tests...")
    
    run_all_tests()
