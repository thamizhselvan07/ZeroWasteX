<div align="center">
  <h1>♻️ ZeroWasteX</h1>
  <p>A full-stack food redistribution platform connecting generous donors with pickup volunteers through an interactive live map, request workflows, and gamified engagement.</p>
</div>

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
