# Adaptive Smart Traffic Control System

A professional, real-time web-based Smart Traffic Control Dashboard for smart cities.

## Features
- **Adaptive Traffic Control**: Real-time green time optimization based on lane density.
- **CO₂ Monitoring**: Comparative analysis between static and adaptive traffic systems.
- **Emergency Priority**: Real-time signal override for emergency vehicles with ETA tracking.
- **Futuristic UI**: High-fidelity glassmorphism dashboard with smooth animations.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Chart.js, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io.

## Project Structure
```text
adaptive-traffic-control/
├── backend/
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AdaptivePanel.jsx
    │   │   ├── AnalyticsPanel.jsx
    │   │   ├── CO2Panel.jsx
    │   │   ├── EmergencyPanel.jsx
    │   │   └── TrafficIntersection.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## Setup Instructions

### 1. Start the Backend
Open a terminal in the `backend` directory:
```bash
cd backend
npm install
npm start
```
The server will start on `http://localhost:5000`.

### 2. Start the Frontend
Open a new terminal in the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
The dashboard will be available at `http://localhost:3000`.

## How to Test
1. **Adaptive Logic**: Watch the green time countdown change as vehicle counts fluctuate.
2. **CO2 Impact**: Observe the reduction percentage grow as the adaptive system optimizes traffic flow.
3. **Emergency Priority**: Click any of the **SIM [DIR]** buttons on the intersection panel to trigger an emergency vehicle override.
