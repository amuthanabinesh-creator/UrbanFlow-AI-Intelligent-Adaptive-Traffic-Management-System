import React, { useRef, useMemo, memo } from 'react';
import { useRafLoop } from '../hooks/useRafLoop';
import { useSimulationLoop } from '../hooks/useSimulationLoop';
import { TrafficSimulation } from '../logic/TrafficSimulation';
import Signals from './Signals';
import Vehicles from './Vehicles';

const IntersectionCanvas = memo(({ trafficData, onTriggerEmergency }) => {
    const simulation = useMemo(() => new TrafficSimulation(), []);
    const vehiclesRef = useRef(null);
    const bgRef = useRef(null);
    const centerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!bgRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        bgRef.current.style.transform = `translate3d(${nx * 30}px, ${ny * 30}px, 0)`;
        if (centerRef.current) {
            centerRef.current.style.transform = `translate3d(${nx * 12}px, ${ny * 12}px, 0)`;
        }
    };

    useSimulationLoop((dt) => {
        simulation.update(dt, trafficData);
    }, 25);

    useRafLoop(() => {
        if (vehiclesRef.current) {
            vehiclesRef.current.update();
        }
    });

    const isEmergency = trafficData?.isEmergencyActive;
    const emergencyLane = trafficData?.emergencyVehicle?.laneId;

    return (
        <div
            className="glass-vibrant rounded-2xl p-6 relative overflow-hidden flex flex-col flex-1 min-h-[500px] select-none group/canvas"
            onMouseMove={handleMouseMove}
        >
            {/* City Grid Background */}
            <div
                ref={bgRef}
                className="city-grid-bg absolute inset-[-80px] opacity-30 pointer-events-none z-0"
                style={{ willChange: 'transform' }}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-5 z-30 relative">
                <div className="flex flex-col">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                            Command Center
                        </h3>
                    </div>
                    <p className="text-[9px] text-slate-400 font-mono tracking-[0.3em] font-bold uppercase mt-1 pl-1">
                        UrbanFlow AI // Grid SC-7742 // Live Feed
                    </p>
                </div>
                <div className="flex gap-2">
                    {['North', 'South', 'East', 'West'].map(lane => (
                        <button
                            key={lane}
                            onClick={() => onTriggerEmergency(lane)}
                            className="ripple-effect px-3 py-1.5 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-lg transition-all duration-300 active:scale-95"
                        >
                            <span className="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-wider transition-colors">
                                🚨 {lane[0]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Intersection Viewport */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden rounded-2xl bg-slate-200 border border-slate-300/60"
                style={{ boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.08)' }}>
                {/* Road surface texture */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)' }} />

                {/* Depth glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,150,105,0.05),transparent_65%)] pointer-events-none" />

                {/* Vertical Road (N-S) */}
                <div className="absolute w-[200px] h-full bg-slate-500 border-x-[4px] border-slate-400/60">
                    <div className="absolute left-1/2 -translate-x-px h-full w-px border-l-2 border-dashed border-white/30" />
                    <div className="absolute top-[38%] w-full h-1 bg-white/20" />
                    <div className="absolute bottom-[38%] w-full h-1 bg-white/20" />
                    <span className="absolute top-6 left-1/2 -translate-x-1/2 text-white/20 font-black text-3xl select-none uppercase tracking-widest">N</span>
                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/20 font-black text-3xl select-none uppercase tracking-widest">S</span>

                    {trafficData?.lanes?.[0]?.density > 0.6 && (
                        <div className="absolute top-0 left-0 w-full h-[38%] bg-gradient-to-b from-red-500/15 to-transparent congestion-pulse pointer-events-none" />
                    )}
                    {trafficData?.lanes?.[1]?.density > 0.6 && (
                        <div className="absolute bottom-0 left-0 w-full h-[38%] bg-gradient-to-t from-red-500/15 to-transparent congestion-pulse pointer-events-none" />
                    )}
                </div>

                {/* Horizontal Road (E-W) */}
                <div className="absolute h-[200px] w-full bg-slate-500 border-y-[4px] border-slate-400/60">
                    <div className="absolute top-1/2 -translate-y-px w-full h-px border-t-2 border-dashed border-white/30" />
                    <div className="absolute left-[38%] h-full w-1 bg-white/20" />
                    <div className="absolute right-[38%] h-full w-1 bg-white/20" />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-black text-3xl select-none uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">W</span>
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 font-black text-3xl select-none uppercase tracking-widest [writing-mode:vertical-lr]">E</span>

                    {trafficData?.lanes?.[2]?.density > 0.6 && (
                        <div className="absolute right-0 top-0 h-full w-[38%] bg-gradient-to-l from-red-500/15 to-transparent congestion-pulse pointer-events-none" />
                    )}
                    {trafficData?.lanes?.[3]?.density > 0.6 && (
                        <div className="absolute left-0 top-0 h-full w-[38%] bg-gradient-to-r from-red-500/15 to-transparent congestion-pulse pointer-events-none" />
                    )}
                </div>

                {/* Central intersection square */}
                <div className="absolute w-[200px] h-[200px] bg-slate-500" />

                {/* Directional arrows */}
                <div className="absolute w-[200px] h-[200px] pointer-events-none z-10 flex items-center justify-center">
                    {trafficData && (
                        <svg viewBox="0 0 100 100" className="w-16 h-16 opacity-10">
                            <polygon points="50,5 60,25 40,25" fill="white" />
                            <polygon points="50,95 60,75 40,75" fill="white" />
                            <polygon points="5,50 25,40 25,60" fill="white" />
                            <polygon points="95,50 75,40 75,60" fill="white" />
                        </svg>
                    )}
                </div>

                {/* Parallax center glow */}
                <div ref={centerRef} className="absolute w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(5,150,105,0.06)_0%,transparent_65%)] pointer-events-none" style={{ willChange: 'transform' }} />

                {/* Emergency lane border pulse */}
                {isEmergency && emergencyLane && (
                    <div className={`absolute pointer-events-none z-20 ${emergencyLane === 'North' || emergencyLane === 'South' ? 'w-[200px] h-full' : 'h-[200px] w-full'
                        }`}>
                        <div className="absolute inset-0 border-2 border-red-500/50 emergency-flash rounded-sm" />
                    </div>
                )}

                <Signals trafficData={trafficData} />
                <Vehicles simulation={simulation} ref={vehiclesRef} />

                {/* Center Phase Badge */}
                <div className="z-40 relative pointer-events-none">
                    <div className="absolute inset-[-20px] bg-primary/10 rounded-full blur-[50px] animate-pulse opacity-40" />
                    <div className="w-28 h-28 bg-white/90 backdrop-blur-xl rounded-full border-2 border-slate-200 flex flex-col items-center justify-center cursor-help"
                        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)' }}>
                        <div className="absolute inset-0 rounded-full border border-transparent border-t-primary/40 animate-[spin_6s_linear_infinite]" />
                        <div className="absolute inset-[3px] rounded-full border border-transparent border-b-accent/30 animate-[spin_10s_linear_infinite_reverse]" />

                        <span className="text-4xl font-black text-slate-800 font-mono leading-none tracking-tighter z-10">
                            {trafficData?.countdown ?? '--'}
                        </span>
                        <div className="h-px w-8 bg-gradient-to-r from-transparent via-primary/40 to-transparent my-1.5 z-10" />
                        <span className="text-[8px] font-black text-primary uppercase tracking-[0.25em] z-10">Phase</span>
                    </div>
                </div>

                {/* Scanline overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.01]"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 2px)' }} />
            </div>

            {/* Bottom Lane Metrics */}
            <div className="mt-5 grid grid-cols-4 gap-3 z-30">
                {trafficData?.lanes?.map((lane, i) => {
                    const isActive = i === trafficData.activeLaneIndex;
                    const density = lane.density || 0;
                    const barColor = density > 0.7 ? 'from-red-500 to-red-400' : density > 0.4 ? 'from-amber-500 to-amber-400' : 'from-emerald-500 to-teal-400';

                    return (
                        <div
                            key={lane.id}
                            className={`px-4 py-3 rounded-xl border transition-all duration-500 relative overflow-hidden ${isActive
                                    ? 'bg-primary/[0.06] border-primary/20'
                                    : 'bg-white/50 border-slate-200/60 opacity-70'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                                        {lane.id[0]}
                                    </span>
                                    <span className={`ml-2 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${lane.congestion === 'High' ? 'bg-red-100 text-red-600' :
                                            lane.congestion === 'Medium' ? 'bg-amber-100 text-amber-600' :
                                                'bg-emerald-100 text-emerald-600'
                                        }`}>
                                        {lane.congestion}
                                    </span>
                                </div>
                                <span className="text-sm font-black text-slate-700 font-mono tabular-nums">{lane.vehicleCount}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out rounded-full relative`}
                                    style={{ width: `${Math.max(8, density * 100)}%` }}
                                >
                                    <div className="absolute inset-0 shimmer-effect" />
                                </div>
                            </div>
                            {isActive && (
                                <div className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

IntersectionCanvas.displayName = 'IntersectionCanvas';

export default IntersectionCanvas;
