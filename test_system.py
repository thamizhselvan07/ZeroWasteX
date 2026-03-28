#!/usr/bin/env python3
"""
Quick test script to verify FoodBridge system is working.
Run this after starting the Flask backend.
"""

import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_system():
    print("🧪 Testing FoodBridge System...\n")
    
    # Test 1: Health check
    print("1️⃣  Testing backend health...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("   ✅ Backend is running")
            print(f"   → {response.json()}\n")
        else:
            print(f"   ❌ Unexpected status: {response.status_code}\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")
        return
    
    # Test 2: Get all foods
    print("2️⃣  Testing /foods/all endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/foods/all", headers={"Origin": "http://localhost:5174"})
        if response.status_code == 200:
            foods = response.json().get("foods", [])
            print(f"   ✅ Fetched {len(foods)} food records")
            print(f"   → Expected: 25 records")
            
            if len(foods) > 0:
                print(f"\n   Sample Record:")
                sample = foods[0]
                print(f"   - Name: {sample.get('name')}")
                print(f"   - Type: {sample.get('type')}")
                print(f"   - Status: {sample.get('status')}")
                print(f"   - Lat/Lng: ({sample.get('latitude')}, {sample.get('longitude')})")
                print(f"   - Quantity: {sample.get('quantity')}")
                print()
            
            # Statistics
            veg_count = len([f for f in foods if f.get('type') == 'veg'])
            non_veg_count = len([f for f in foods if f.get('type') == 'non-veg'])
            available_count = len([f for f in foods if f.get('status') == 'available'])
            
            print(f"   📊 Statistics:")
            print(f"   - Vegetarian: {veg_count}")
            print(f"   - Non-Vegetarian: {non_veg_count}")
            print(f"   - Available: {available_count}\n")
        else:
            print(f"   ❌ Status: {response.status_code}")
            print(f"   → {response.text}\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")
    
    # Test 3: Activity feed
    print("3️⃣  Testing /activity-feed endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/activity-feed", headers={"Origin": "http://localhost:5174"})
        if response.status_code == 200:
            activities = response.json().get("activities", [])
            print(f"   ✅ Fetched {len(activities)} activity records\n")
        else:
            print(f"   ❌ Status: {response.status_code}\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")
    
    # Test 4: Signup
    print("4️⃣  Testing /signup endpoint...")
    try:
        payload = {
            "name": "Test User",
            "email": "test@foodbridge.local",
            "password": "test123456"
        }
        response = requests.post(f"{BASE_URL}/signup", json=payload)
        if response.status_code in [201, 409]:  # 409 if already exists
            print(f"   ✅ Signup working (status: {response.status_code})")
            if response.status_code == 201:
                print(f"   → User created successfully\n")
            else:
                print(f"   → User already exists\n")
        else:
            print(f"   ❌ Status: {response.status_code}\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")
    
    # Test 5: Login
    print("5️⃣  Testing /login endpoint...")
    try:
        payload = {
            "email": "test@foodbridge.local",
            "password": "test123456"
        }
        response = requests.post(f"{BASE_URL}/login", json=payload)
        if response.status_code == 200:
            data = response.json()
            token = data.get("token")
            print(f"   ✅ Login successful")
            print(f"   → Token: {token[:20]}...\n")
            return token
        else:
            print(f"   ❌ Status: {response.status_code}\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")
    
    print("=" * 50)
    print("🎉 FoodBridge System Testing Complete!")
    print("=" * 50)

if __name__ == "__main__":
    test_system()
