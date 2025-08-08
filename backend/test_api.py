#!/usr/bin/env python3
"""
Test script for the MetaSelect FastAPI backend
"""

import requests
import json
import sys
import os

BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print("✅ Health check passed")
            print(f"   Status: {data.get('status')}")
            print(f"   Model loaded: {data.get('model_loaded')}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API server")
        print("   Make sure the server is running on http://localhost:8000")
        return False

def test_model_info():
    """Test the model info endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/model-info")
        if response.status_code == 200:
            data = response.json()
            print("✅ Model info retrieved")
            print(f"   Model type: {data.get('model_type')}")
            print(f"   Input shape: {data.get('input_shape')}")
            print(f"   Total parameters: {data.get('total_parameters'):,}")
            return True
        else:
            print(f"❌ Model info failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API server")
        return False

def test_prediction():
    """Test the prediction endpoint with a sample image"""
    # Create a simple test image (1x1 pixel)
    from PIL import Image
    import io
    
    # Create a small test image
    test_image = Image.new('RGB', (224, 224), color='white')
    img_byte_arr = io.BytesIO()
    test_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    try:
        files = {'file': ('test.png', img_byte_arr, 'image/png')}
        response = requests.post(f"{BASE_URL}/predict", files=files)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Prediction test passed")
            print(f"   Probability: {data.get('probability')}%")
            print(f"   Diagnosis: {data.get('diagnosis')}")
            print(f"   Confidence: {data.get('confidence')}")
            return True
        else:
            print(f"❌ Prediction test failed: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data.get('detail')}")
            except:
                print(f"   Response: {response.text}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API server")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing MetaSelect API Backend")
    print("=" * 40)
    
    tests = [
        ("Health Check", test_health),
        ("Model Info", test_model_info),
        ("Prediction", test_prediction),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing {test_name}...")
        if test_func():
            passed += 1
        else:
            print(f"   ❌ {test_name} failed")
    
    print("\n" + "=" * 40)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The API is working correctly.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the server logs.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
