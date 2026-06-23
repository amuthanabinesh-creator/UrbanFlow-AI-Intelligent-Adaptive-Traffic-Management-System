import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ambulance, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const TrafficIntersection = ({ trafficData, onTriggerEmergency }) => {
    const { lanes, activeLaneIndex, countdown, isEmergencyActive, emergencyVehicle } = trafficData;

    const DirectionIcon = ({ dir, size = 16 }) => {
        switch (dir) {
            case 'North': return <ArrowDown size={size} />;
            case 'South': return <ArrowUp size={size} />;
            case 'East': return <ArrowLeft size={size} />;
            case 'West': return <ArrowRight size={size} />;
            default: return null;
        }
    };

    return (
        <div className="glass rounded-2xl p-6 relative overflow-hidden flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Intersection Simulation</h3>
                    <p className="text-xs text-slate-500">Node ID: SC-7742 (Adaptive Control)</p>
                </div>
                <div className="flex space-x-2">
                    {['North', 'South', 'East', 'West'].map(laneId => (
                        <button
                            key={laneId}
                            onClick={() => onTriggerEmergency(laneId)}
                            className="px-3 py-1 bg-secondary/10 hover:bg-secondary/30 text-secondary border border-secondary/20 rounded text-[10px] font-bold transition-all"
                        >
                            SIM {laneId}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center">
                {/* Roads */}
                <div className="absolute w-24 h-full bg-slate-800/50 border-x border-white/5" />
                <div className="absolute h-24 w-full bg-slate-800/50 border-y border-white/5" />

                {/* Lane Indicators */}
                {lanes.map((lane, idx) => {
                    const isActive = idx === activeLaneIndex;
                    const posStyles = {
                        North: "top-4 left-1/2 -translate-x-1/2",
                        South: "bottom-4 left-1/2 -translate-x-1/2",
                        East: "right-4 top-1/2 -translate-y-1/2",
                        West: "left-4 top-1/2 -translate-y-1/2"
                    };

                    return (
                        <div key={lane.id} className={`absolute ${posStyles[lane.id]} flex flex-col items-center space-y-2`}>
                            <div className="text-[10px] font-bold text-slate-500 uppercase">{lane.id}</div>
                            <div className={`w-8 h-12 rounded-lg border flex flex-col items-center justify-between p-1 transition-all duration-500 ${isActive
                                    ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                    : 'bg-slate-900 border-white/10'
                                }`}>
                                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-800'}`} />
                                <div className={`w-3 h-3 rounded-full ${!isActive && !isEmergencyActive ? 'bg-secondary' : 'bg-slate-800'}`} />
                            </div>
                            <div className="text-xs font-mono font-bold text-white">{lane.vehicleCount} v.</div>
                        </div>
                    );
                })}

                {/* Central UI */}
                <div className="z-10 bg-black/80 backdrop-blur-xl w-32 h-32 rounded-full border border-white/10 flex flex-col items-center justify-center shadow-2xl">
                    <AnimatePresence mode="wait">
                        {isEmergencyActive ? (
                            <motion.div
                                key="emergency"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className="flex flex-col items-center"
                            >
                                <Ambulance size={32} className="text-secondary animate-pulse" />
                                <span className="text-[10px] font-bold text-secondary mt-1">EMERGENCY</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="normal"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center"
                            >
                                <span className="text-3xl font-bold text-primary font-mono">{countdown}</span>
                                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Seconds</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Active Lane Visualizer */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute transition-all duration-700 ${lanes[activeLaneIndex].id === 'North' ? 'top-0 h-1/2' :
                            lanes[activeLaneIndex].id === 'South' ? 'bottom-0 h-1/2' :
                                lanes[activeLaneIndex].id === 'East' ? 'right-0 w-1/2' : 'left-0 w-1/2'
                        } ${['North', 'South'].includes(lanes[activeLaneIndex].id) ? 'left-1/2 -translate-x-1/2 w-20' : 'top-1/2 -translate-y-1/2 h-20'} bg-gradient-to-b from-primary/20 to-transparent opacity-30`} />
                </div>
            </div>

            {/* Intersection Legend */}
            <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-white/5">
                {lanes.map(lane => (
                    <div key={lane.id} className="flex flex-col">
                        <span className="text-[9px] text-slate-500 uppercase">{lane.id} Lane</span>
                        <div className="flex items-center space-x-1">
                            <span className={`text-[10px] font-bold ${lane.density > 0.7 ? 'text-secondary' : lane.density > 0.4 ? 'text-warning' : 'text-primary'}`}>
                                {Math.round(lane.density * 100)}% DENSITY
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrafficIntersection;
