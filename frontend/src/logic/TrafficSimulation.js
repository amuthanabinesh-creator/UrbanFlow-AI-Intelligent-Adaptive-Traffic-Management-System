/**
 * TrafficSimulation — Physics Engine
 * Handles vehicle motion, lane state, acceleration/deceleration, stacking.
 * Updated via refs only — never triggers React re-renders.
 * Optimized for 120fps-class animation reads.
 */

const CONSTANTS = {
    VEHICLE_LENGTH: 26,
    MIN_GAP: 14,
    STOP_LINE_BUFFER: 40,
    MAX_SPEED: 3.8,
    ACCEL: 0.08,
    DECEL: 0.18,
    BRAKE_DECEL: 0.25,
    EMERGENCY_SPEED: 5.5,
    STOP_LINE: 140,
    LANE_BOUND: 380,
    MAX_VEHICLES_PER_LANE: 18,
    SPAWN_PROBABILITY: 0.92,
    BRAKING_ZONE: 120,
};

const VEHICLE_COLORS = [
    '#0ea5e9', '#6366f1', '#a855f7', '#ec4899',
    '#f43f5e', '#ffffff', '#94a3b8', '#06b6d4',
    '#8b5cf6', '#f97316', '#64748b', '#e2e8f0',
];

export class TrafficSimulation {
    constructor() {
        this.lanes = {
            North: { vehicles: [], stopLine: CONSTANTS.STOP_LINE, dir: { x: 0, y: 1 } },
            South: { vehicles: [], stopLine: CONSTANTS.STOP_LINE, dir: { x: 0, y: -1 } },
            East: { vehicles: [], stopLine: CONSTANTS.STOP_LINE, dir: { x: -1, y: 0 } },
            West: { vehicles: [], stopLine: CONSTANTS.STOP_LINE, dir: { x: 1, y: 0 } },
        };
        this.activeLaneId = 'North';
        this.isEmergency = false;
        this.emergencyLaneId = null;
        this._idCounter = 0;
    }

    update(dt, trafficData) {
        if (!trafficData) return;

        this.activeLaneId = trafficData.lanes[trafficData.activeLaneIndex]?.id || 'North';
        this.isEmergency = !!trafficData.isEmergencyActive;
        this.emergencyLaneId = trafficData.emergencyVehicle?.laneId || null;

        const laneIds = Object.keys(this.lanes);
        for (let li = 0; li < laneIds.length; li++) {
            const laneId = laneIds[li];
            const lane = this.lanes[laneId];
            const laneData = trafficData.lanes.find(l => l.id === laneId);
            if (!laneData) continue;

            const targetCount = Math.min(laneData.vehicleCount, CONSTANTS.MAX_VEHICLES_PER_LANE);
            const isGreen = this.isEmergency
                ? this.emergencyLaneId === laneId
                : this.activeLaneId === laneId;

            // Spawn vehicles gradually
            if (lane.vehicles.length < targetCount && Math.random() > CONSTANTS.SPAWN_PROBABILITY) {
                this._spawnVehicle(lane);
            }

            // Remove excess (from back)
            while (lane.vehicles.length > targetCount + 2) {
                lane.vehicles.pop();
            }

            // Update physics — iterate front-to-back for stacking
            for (let i = 0; i < lane.vehicles.length; i++) {
                const vehicle = lane.vehicles[i];
                const prevVehicle = lane.vehicles[i - 1];

                let targetSpeed = this.isEmergency && this.emergencyLaneId === laneId
                    ? CONSTANTS.EMERGENCY_SPEED
                    : CONSTANTS.MAX_SPEED;

                // === Signal Logic ===
                if (!isGreen) {
                    const distToStop = -vehicle.pos - lane.stopLine;
                    if (distToStop > 0 && distToStop < CONSTANTS.BRAKING_ZONE) {
                        const brakeFactor = distToStop / CONSTANTS.BRAKING_ZONE;
                        targetSpeed = Math.min(targetSpeed, CONSTANTS.MAX_SPEED * brakeFactor);
                    }
                    if (distToStop <= 10 && distToStop > -20) {
                        targetSpeed = 0;
                    }
                }

                // === Vehicle Stacking (Collision Avoidance) ===
                if (prevVehicle) {
                    const gap = Math.abs(prevVehicle.pos - vehicle.pos) - CONSTANTS.VEHICLE_LENGTH;
                    if (gap < CONSTANTS.MIN_GAP + 40) {
                        const gapFactor = Math.max(0, (gap - CONSTANTS.MIN_GAP) / 40);
                        targetSpeed = Math.min(targetSpeed, prevVehicle.speed * 1.05 * gapFactor);
                    }
                    if (gap < CONSTANTS.MIN_GAP) {
                        targetSpeed = 0;
                        vehicle.pos = prevVehicle.pos - CONSTANTS.VEHICLE_LENGTH - CONSTANTS.MIN_GAP;
                    }
                }

                // === Acceleration / Deceleration ===
                const wasBraking = vehicle.isBraking;
                if (vehicle.speed < targetSpeed) {
                    vehicle.speed += CONSTANTS.ACCEL;
                    vehicle.isBraking = false;
                } else if (vehicle.speed > targetSpeed + 0.05) {
                    vehicle.speed -= vehicle.speed > targetSpeed + 1 ? CONSTANTS.BRAKE_DECEL : CONSTANTS.DECEL;
                    vehicle.isBraking = true;
                } else {
                    vehicle.isBraking = false;
                }

                // Clamp
                vehicle.speed = Math.max(0, Math.min(vehicle.speed, CONSTANTS.EMERGENCY_SPEED));

                // Position
                vehicle.pos += vehicle.speed;

                // Recycle
                if (vehicle.pos > CONSTANTS.LANE_BOUND) {
                    vehicle.pos = -CONSTANTS.LANE_BOUND - (Math.random() * 60);
                    vehicle.speed = CONSTANTS.MAX_SPEED * (0.3 + Math.random() * 0.4);
                    vehicle.color = VEHICLE_COLORS[Math.floor(Math.random() * VEHICLE_COLORS.length)];
                    vehicle.isBraking = false;
                }
            }
        }
    }

    _spawnVehicle(lane) {
        const lastVehicle = lane.vehicles[lane.vehicles.length - 1];
        const startPos = -CONSTANTS.LANE_BOUND;

        if (lastVehicle && lastVehicle.pos < startPos + CONSTANTS.VEHICLE_LENGTH + CONSTANTS.MIN_GAP + 10) {
            return;
        }

        this._idCounter++;
        lane.vehicles.push({
            id: `v${this._idCounter}`,
            pos: startPos,
            speed: CONSTANTS.MAX_SPEED * (0.4 + Math.random() * 0.3),
            type: Math.random() > 0.82 ? 'truck' : 'car',
            color: VEHICLE_COLORS[Math.floor(Math.random() * VEHICLE_COLORS.length)],
            isBraking: false,
        });
    }

    getLaneDensity(laneId) {
        const lane = this.lanes[laneId];
        if (!lane) return 0;
        return lane.vehicles.length / CONSTANTS.MAX_VEHICLES_PER_LANE;
    }
}
