import React, { useRef, useImperativeHandle, forwardRef, memo, useEffect } from 'react';

/**
 * Vehicles — SVG-based vehicle rendering.
 * Positions update every rAF frame via imperative DOM manipulation (refs).
 * React only renders the initial vehicle DOM — no re-renders per frame.
 * 
 * Performance optimizations:
 * - Pre-cache DOM references per vehicle
 * - No querySelectorAll per frame (was expensive)
 * - GPU-accelerated transforms only
 * - Brake/headlight states set via direct style property
 */

const LANE_OFFSET = 42;

const Vehicles = forwardRef(({ simulation }, ref) => {
    const containerRef = useRef(null);
    const vehicleEls = useRef({}); // id -> DOM element cache
    const brakeEls = useRef({});   // id -> brake light elements
    const headEls = useRef({});    // id -> headlight elements

    useImperativeHandle(ref, () => ({
        update: () => {
            if (!simulation || !containerRef.current) return;

            const entries = Object.entries(simulation.lanes);
            for (let e = 0; e < entries.length; e++) {
                const [laneId, lane] = entries[e];
                const vehicles = lane.vehicles;

                for (let i = 0; i < vehicles.length; i++) {
                    const vehicle = vehicles[i];
                    const el = vehicleEls.current[vehicle.id];
                    if (!el) continue;

                    // Calculate position based on lane direction
                    let x = 0, y = 0, rotation = 0;
                    if (laneId === 'North') {
                        x = -LANE_OFFSET; y = vehicle.pos; rotation = 90;
                    } else if (laneId === 'South') {
                        x = LANE_OFFSET; y = -vehicle.pos; rotation = -90;
                    } else if (laneId === 'East') {
                        x = -vehicle.pos; y = LANE_OFFSET; rotation = 180;
                    } else if (laneId === 'West') {
                        x = vehicle.pos; y = -LANE_OFFSET; rotation = 0;
                    }

                    // GPU transform — translate3d + rotate
                    const speedRatio = vehicle.speed / 3.8;
                    el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;
                    el.style.opacity = String(1 - speedRatio * 0.08);

                    // Brake lights — direct property access (no query)
                    const brakes = brakeEls.current[vehicle.id];
                    if (brakes) {
                        const braking = vehicle.isBraking || vehicle.speed < 0.15;
                        brakes.style.opacity = braking ? '1' : '0.2';
                        brakes.style.fill = braking ? '#f43f5e' : '#7f1d1d';
                    }

                    // Headlights brightness based on speed
                    const heads = headEls.current[vehicle.id];
                    if (heads) {
                        heads.style.opacity = String(0.5 + speedRatio * 0.5);
                    }
                }
            }
        }
    }));

    // Build flat vehicle list for rendering
    const allVehicles = [];
    const entries = Object.entries(simulation.lanes);
    for (let e = 0; e < entries.length; e++) {
        const [laneId, lane] = entries[e];
        for (let i = 0; i < lane.vehicles.length; i++) {
            allVehicles.push({ ...lane.vehicles[i], laneId });
        }
    }

    return (
        <svg
            ref={containerRef}
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-30"
            viewBox="-400 -400 800 800"
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <linearGradient id="headlightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#fef9c3" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="brakeGlow" x1="100%" y1="50%" x2="0%" y2="50%">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </linearGradient>
            </defs>

            {allVehicles.map(vehicle => {
                const isEmergencyVehicle = vehicle.laneId === simulation.emergencyLaneId && simulation.isEmergency;
                const w = vehicle.type === 'truck' ? 34 : 26;

                return (
                    <g
                        key={vehicle.id}
                        ref={el => { vehicleEls.current[vehicle.id] = el; }}
                        style={{ willChange: 'transform, opacity' }}
                    >
                        {isEmergencyVehicle ? (
                            /* Emergency vehicle */
                            <>
                                <rect width="30" height="14" rx="4" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" />
                                <rect x="4" y="2" width="22" height="10" rx="2" fill="#ef4444" fillOpacity="0.7" />
                                <rect x="25" y="4" width="3" height="6" rx="1" fill="#facc15" />
                                <circle cx="8" cy="3" r="2" fill="#3b82f6" opacity="0.9">
                                    <animate attributeName="opacity" values="1;0.2;1" dur="0.5s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="8" cy="11" r="2" fill="#ef4444" opacity="0.9">
                                    <animate attributeName="opacity" values="0.2;1;0.2" dur="0.5s" repeatCount="indefinite" />
                                </circle>
                            </>
                        ) : (
                            /* Normal vehicle */
                            <>
                                <rect width={w} height="13" rx="3.5" fill={vehicle.color} fillOpacity="0.9" />
                                {/* Windshield */}
                                <rect x={w - 9} y="2" width="6" height="9" rx="1.5" fill="#0f172a" fillOpacity="0.7" />
                                {/* Rear section */}
                                <rect x="1" y="2.5" width="3" height="8" rx="1" fill="#0f172a" fillOpacity="0.3" />
                            </>
                        )}

                        {/* Headlights */}
                        <g ref={el => { headEls.current[vehicle.id] = el; }} style={{ opacity: 0.6 }}>
                            <circle cx={w + 1} cy="3.5" r="1.8" fill="#fef9c3" />
                            <circle cx={w + 1} cy="9.5" r="1.8" fill="#fef9c3" />
                            <path d={`M${w + 2},3 L${w + 25},-2 L${w + 25},8 Z`} fill="url(#headlightBeam)" opacity="0.15" />
                            <path d={`M${w + 2},10 L${w + 25},5 L${w + 25},15 Z`} fill="url(#headlightBeam)" opacity="0.15" />
                        </g>

                        {/* Brake lights */}
                        <g ref={el => { brakeEls.current[vehicle.id] = el; }} style={{ opacity: 0.2 }}>
                            <rect x="-1" y="2.5" width="2.5" height="3" rx="1" fill="#7f1d1d" />
                            <rect x="-1" y="7.5" width="2.5" height="3" rx="1" fill="#7f1d1d" />
                            {/* Brake glow trail */}
                            <path d="M-1,4 L-18,0 L-18,8 Z" fill="url(#brakeGlow)" opacity="0.3" />
                            <path d="M-1,9 L-18,5 L-18,13 Z" fill="url(#brakeGlow)" opacity="0.3" />
                        </g>
                    </g>
                );
            })}
        </svg>
    );
});

Vehicles.displayName = 'Vehicles';

export default memo(Vehicles);
