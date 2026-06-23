const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let trafficData = {
  lanes: [
    { id: 'North', vehicleCount: 15, greenTime: 30, congestion: 'Medium', density: 0.4 },
    { id: 'South', vehicleCount: 12, greenTime: 30, congestion: 'Low', density: 0.3 },
    { id: 'East', vehicleCount: 25, greenTime: 30, congestion: 'High', density: 0.7 },
    { id: 'West', vehicleCount: 18, greenTime: 30, congestion: 'Medium', density: 0.5 }
  ],
  activeLaneIndex: 0,
  countdown: 30,
  isEmergencyActive: false,
  emergencyVehicle: null,
  emissions: {
    staticTotal: 0,
    adaptiveTotal: 0,
    savedTotal: 0,
    reductionPercent: 0
  },
  stats: {
    avgWaitingTime: 45,
    congestionReduction: 12
  }
};

const BASE_GREEN_TIME = 15;
const MAX_GREEN_TIME = 60;
const SCALING_FACTOR = 1.5;

function calculateAdaptiveGreenTime(lane) {
  const totalVehicles = trafficData.lanes.reduce((sum, l) => sum + l.vehicleCount, 0);
  const proportion = lane.vehicleCount / (totalVehicles || 1);
  return Math.min(MAX_GREEN_TIME, Math.round(BASE_GREEN_TIME + proportion * 45));
}

function updateEmissions() {
  // Logic: Static system has fixed green time (e.g. 30s) leads to more idle time.
  // Co2 = vehicleCount * idleTime * 0.02 (kg/sec factor)

  trafficData.lanes.forEach(lane => {
    // Static simulation: assume 30s cycle for everyone
    const staticIdle = Math.max(0, lane.vehicleCount * 0.5);
    const adaptiveIdle = Math.max(0, (lane.vehicleCount * 0.5) * (1 - (lane.greenTime / MAX_GREEN_TIME)));

    const staticCO2 = staticIdle * 0.015;
    const adaptiveCO2 = adaptiveIdle * 0.015;

    trafficData.emissions.staticTotal += staticCO2;
    trafficData.emissions.adaptiveTotal += adaptiveCO2;
  });

  trafficData.emissions.savedTotal = trafficData.emissions.staticTotal - trafficData.emissions.adaptiveTotal;
  trafficData.emissions.reductionPercent = (trafficData.emissions.savedTotal / (trafficData.emissions.staticTotal || 1)) * 100;
}

function simulationLoop() {
  if (trafficData.countdown > 0) {
    trafficData.countdown--;
  } else {
    // Switch Lane
    if (!trafficData.isEmergencyActive) {
      trafficData.activeLaneIndex = (trafficData.activeLaneIndex + 1) % 4;
      const nextLane = trafficData.lanes[trafficData.activeLaneIndex];
      trafficData.countdown = calculateAdaptiveGreenTime(nextLane);
      nextLane.greenTime = trafficData.countdown;
    } else {
      // Return to normal after emergency
      trafficData.isEmergencyActive = false;
      trafficData.emergencyVehicle = null;
      trafficData.activeLaneIndex = (trafficData.activeLaneIndex + 1) % 4;
      trafficData.countdown = 30;
    }
  }

  // Randomly update vehicle counts
  trafficData.lanes.forEach(lane => {
    lane.vehicleCount += Math.floor(Math.random() * 3) - 1;
    if (lane.vehicleCount < 5) lane.vehicleCount = 5;
    if (lane.vehicleCount > 50) lane.vehicleCount = 50;

    lane.density = lane.vehicleCount / 50;
    lane.congestion = lane.density > 0.7 ? 'High' : lane.density > 0.4 ? 'Medium' : 'Low';
  });

  updateEmissions();
  io.emit('trafficUpdate', trafficData);
}

setInterval(simulationLoop, 1000);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('trafficUpdate', trafficData);

  socket.on('triggerEmergency', (laneId) => {
    console.log('Emergency triggered for lane:', laneId);
    trafficData.isEmergencyActive = true;
    trafficData.emergencyVehicle = {
      laneId: laneId,
      eta: 5,
      type: 'Ambulance'
    };

    // Immediate override
    const laneIndex = trafficData.lanes.findIndex(l => l.id === laneId);
    trafficData.activeLaneIndex = laneIndex;
    trafficData.countdown = 15; // Priority green time
    io.emit('emergencyAlert', trafficData.emergencyVehicle);
  });
});

const PORT = process.env.PORT || 5100;
server.listen(PORT, () => {
  console.log(`Traffic Backend running on port ${PORT}`);
});
