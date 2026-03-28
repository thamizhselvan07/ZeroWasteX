#!/usr/bin/env python3
"""Debug script to test activity-feed endpoint"""

import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_activity_feed():
    print("Testing /activity-feed endpoint...\n")
    
    try:
        response = requests.get(f"{BASE_URL}/activity-feed")
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"\nParsed JSON: {json.dumps(data, indent=2)}")
        else:
            print(f"\nError response received")
    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")

if __name__ == "__main__":
    test_activity_feed()
