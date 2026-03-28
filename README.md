<div align="center">
  <h1>♻️ FoodBridge</h1>
  <p>A full-stack food redistribution platform connecting generous donors with pickup volunteers through an interactive live map, request workflows, and gamified engagement.</p>
</div>

## 🎯 Problem Statement
**Food waste is a critical global issue.** Millions of tons of surplus food from restaurants, grocery stores, and homes are discarded daily, while many communities face food insecurity. Current solutions lack:
- **Real-time visibility** of available surplus food
- **Efficient coordination** between donors and volunteers
- **Community engagement** to incentivize participation
- **Transparent impact tracking** of redistribution efforts

## ✅ Solution
**FoodBridge** is a digital platform that:
1. **Connects Donors with Volunteers** - Real-time map shows available surplus food items with precise locations
2. **Streamlines Logistics** - Volunteers can easily request and pickup surplus food through an intuitive workflow
3. **Gamifies Participation** - Leaderboard system rewards active volunteers, building community engagement
4. **Tracks Impact** - Comprehensive metrics dashboard shows real-time food redistribution statistics globally
5. **Enables Accessibility** - User-friendly interface makes participation easy for both donors and volunteers

Result: **More food gets redistributed, less food goes to waste, and communities engage in sustainable food practices.**

## 🌐 Live Deployments
- **Frontend (Vercel):** [https://zero-waste-x.vercel.app/](https://zero-waste-x.vercel.app/)
- **Backend API (Render):** [https://zerowastex-backend-h1k8.onrender.com](https://zerowastex-backend-h1k8.onrender.com)

## ✨ Core Features
- **Live Rescue Map:** Discover nearby surplus food via interactive map clustering.
- **Dynamic Pickup Workflow:** Transitions items natively from `Available` ➔ `Requested` ➔ `Picked` states.
- **Smart Filtering:** Categorize donations quickly (Veg, Non-Veg) to fit volunteer needs.
- **Gamified Leaderboard:** Rewards volunteers with points based on pickups, tracking top heroes.
- **Activity Feed & Metrics Dashboard:** Tracks global redistribution impact in real-time.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Framer Motion, Tailwind CSS
- **Backend:** Python, Flask, Flask-CORS
- **Database:** MongoDB (or dynamic in-memory emulation for prototyping/testing)
- **Deployment:** Vercel (Frontend) & Render (Backend API Web Service)

## 🚀 Local Development Setup

### Backend (Python/Flask)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the API Server:
   ```bash
   python app.py
   ```
*(Optional) To seed the application database with a fresh 25-item dataset manually, run:*
`python scripts/seed_sample_foods.py`

### Frontend (React/Vite)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 📜 License
This project is open-source and created for good.
