# ZeroWasteX

ZeroWasteX is a full-stack food redistribution platform that connects donors and pickup volunteers through a live map and request workflow.

## Tech Stack
- React
- Flask
- PostgreSQL

## Setup
1. Install backend dependencies: `pip install -r backend/requirements.txt`
2. Install frontend dependencies: `npm install` inside `frontend/`
3. Run the Flask API: `python backend/app.py`
4. Run the Vite client: `npm run dev` from `frontend/`

## Features
- Real-time rescue map with veg and non-veg markers
- Pickup workflow (available -> requested -> picked)
- User-specific "My Requests" tracking page
