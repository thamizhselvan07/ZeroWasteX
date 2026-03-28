#!/usr/bin/env python3
"""Debug script to test authenticated endpoints with detailed error information"""

import requests
import json
import traceback

BASE_URL = "http://127.0.0.1:5000"

def test_endpoints():
    print("=" * 60)
    print("Testing Authenticated Endpoints")
    print("=" * 60)
    
    # Test my-requests endpoint WITHOUT auth (expect 401)
    print("\n1️⃣  Testing /api/my-requests WITHOUT auth:")
    try:
        response = requests.get(f"{BASE_URL}/api/my-requests", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:500]}")
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
    
    # Test my-requests endpoint WITH invalid auth token (expect 401)
    print("\n2️⃣  Testing /api/my-requests WITH invalid token:")
    try:
        response = requests.get(
            f"{BASE_URL}/api/my-requests",
            headers={"Authorization": "Bearer invalid_token"},
            timeout=5
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:500]}")
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
    
    # Test activity-feed endpoint (no auth needed)
    print("\n3️⃣  Testing /activity-feed:")
    try:
        response = requests.get(f"{BASE_URL}/activity-feed", timeout=5)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Activities count: {len(data.get('activities', []))}")
        else:
            print(f"Response: {response.text[:500]}")
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
    
    # Test user-history endpoint (needs auth)
    print("\n4️⃣  Testing /user-history WITHOUT auth:")
    try:
        response = requests.get(f"{BASE_URL}/user-history", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:500]}")
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
    
    # Test signup
    print("\n5️⃣  Testing /signup:")
    try:
        payload = {
            "name": "Debug Test User",
            "email": "debug@test.local",
            "password": "debugpass123"
        }
        response = requests.post(f"{BASE_URL}/signup", json=payload, timeout=5)
        print(f"Status: {response.status_code}")
        if response.status_code in [201, 409]:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
        else:
            print(f"Response: {response.text[:500]}")
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    test_endpoints()
