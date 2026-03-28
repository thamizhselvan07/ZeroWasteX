#!/usr/bin/env python3
"""Test endpoints with authentication and verify all functionality"""

import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_all_endpoints():
    print("=" * 70)
    print("COMPREHENSIVE FOODBRIDGE SYSTEM TEST")
    print("=" * 70)
    
    # Step 1: Get foods to check we have 25 records
    print("\n1️⃣  Getting all available food items...")
    try:
        response = requests.get(f"{BASE_URL}/foods/all")
        if response.status_code == 200:
            foods = response.json().get("foods", [])
            print(f"   ✅ SUCCESS: Found {len(foods)} food records")
            if len(foods) == 25:
                print("   ✅ Correct count: 25 records")
            else:
                print(f"   ⚠️  Expected 25 records, got {len(foods)}")
            
            # Show statistics
            veg = len([f for f in foods if f.get("type") == "veg"])
            non_veg = len([f for f in foods if f.get("type") == "non-veg"])
            print(f"   📊 Vegetarian: {veg}, Non-Vegetarian: {non_veg}")
        else:
            print(f"   ❌ FAILED: Status {response.status_code}")
    except Exception as e:
        print(f"   ❌ ERROR: {e}")
    
    # Step 2: Test activity feed
    print("\n2️⃣  Getting activity feed...")
    try:
        response = requests.get(f"{BASE_URL}/activity-feed")
        if response.status_code == 200:
            activities = response.json().get("activities", [])
            print(f"   ✅ SUCCESS: Found {len(activities)} activity records")
        else:
            print(f"   ❌ FAILED: Status {response.status_code}")
    except Exception as e:
        print(f"   ❌ ERROR: {e}")
    
    # Step 3: Create a test user
    print("\n3️⃣  Creating test user...")
    import random
    email = f"test{random.randint(1000, 9999)}@foodbridge.local"
    password = "test123456"
    
    try:
        payload = {
            "name": "Test User",
            "email": email,
            "password": password,
            "role": "volunteer"
        }
        response = requests.post(f"{BASE_URL}/signup", json=payload)
        if response.status_code == 201:
            token = response.json().get("token")
            print(f"   ✅ User created: {email}")
            print(f"   ✅ Token received (length: {len(token)} chars)")
            
            # Step 4: Test authenticated endpoints
            headers = {"Authorization": f"Bearer {token}"}
            
            print("\n4️⃣  Testing authenticated endpoints...")
            
            # Get my requests
            try:
                response = requests.get(f"{BASE_URL}/api/my-requests", headers=headers)
                if response.status_code == 200:
                    requests_count = len(response.json().get("foods", []))
                    print(f"   ✅ My Requests: {requests_count} items")
                else:
                    print(f"   ❌ My Requests FAILED: Status {response.status_code}")
            except Exception as e:
                print(f"   ❌ My Requests ERROR: {e}")
            
            # Get user history
            try:
                response = requests.get(f"{BASE_URL}/user-history", headers=headers)
                if response.status_code == 200:
                    history_count = len(response.json().get("history", []))
                    print(f"   ✅ User History: {history_count} items")
                else:
                    print(f"   ❌ User History FAILED: Status {response.status_code}")
            except Exception as e:
                print(f"   ❌ User History ERROR: {e}")
            
            # Test making a food request
            print("\n5️⃣  Testing food request (PATCH)...")
            try:
                # Request the first available food
                food_response = requests.get(f"{BASE_URL}/foods/all")
                if food_response.status_code == 200:
                    foods = food_response.json().get("foods", [])
                    if foods:
                        food_id = foods[0].get("id")
                        food_name = foods[0].get("name")
                        
                        # Try to request the food
                        request_response = requests.patch(
                            f"{BASE_URL}/api/foods/{food_id}/request",
                            headers=headers,
                            json={}
                        )
                        if request_response.status_code == 200:
                            print(f"   ✅ Food request submitted for '{food_name}'")
                        else:
                            print(f"   ⚠️  Food request failed: Status {request_response.status_code}")
                            if "Access-Control-Allow-Origin" in request_response.headers:
                                print(f"   ✅ CORS header present")
                            else:
                                print(f"   ❌ Missing CORS header")
            except Exception as e:
                print(f"   ⚠️  ERROR: {e}")
        else:
            print(f"   ❌ FAILED: Status {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ❌ ERROR: {e}")
    
    print("\n" + "=" * 70)
    print("TEST COMPLETE")
    print("=" * 70)

if __name__ == "__main__":
    test_all_endpoints()
