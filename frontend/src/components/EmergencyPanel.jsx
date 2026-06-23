import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Ambulance, Timer, AlertCircle, ChevronRight } from 'lucide-react';

const EmergencyPanel = ({ emergency, detailed = false, onTrigger }) => {
    return (
        <div className={`glass rounded-2xl p-6 relative overflow-hidden transition-all duration-500 ${emergency ? 'neon-border-green bg-red-500/5' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${emergency ? 'bg-secondary/20' : 'bg-slate-700/30'}`}>
                        <ShieldAlert size={18} className={emergency ? 'text-secondary' : 'text-slate-500'} />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Priority Layer</h3>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {emergency ? (
                    <motion.div
                        key="active"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-4"
                    >
                        <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-xl flex items-center space-x-4">
                            <Ambulance className="text-secondary animate-pulse" size={32} />
                            <div>
                                <div className="text-xs font-bold text-secondary uppercase tracking-tight">Active Emergency</div>
                                <div className="text-lg font-bold text-white uppercase tracking-tighter">Lane: {emergency.laneId}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-[10px] text-slate-500 uppercase mb-1 flex items-center">
                                    <Timer size={10} className="mr-1" /> ETA
                                </div>
                                <div className="text-xl font-bold text-white font-mono">{emergency.eta}s</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="text-[10px] text-slate-500 uppercase mb-1">Status</div>
                                <div className="text-[10px] font-bold text-primary uppercase animate-pulse">OVERRIDING</div>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                            <div className="text-[10px] font-bold text-primary mb-1 uppercase">Decision Logic</div>
                            <p className="text-[10px] text-slate-400 leading-tight">Conflicts resolved. Lane {emergency.laneId} granted green priority until clearance.</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-6 text-center"
                    >
                        <div className="w-12 h-12 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-3">
                            <AlertCircle size={24} className="text-slate-700" />
                        </div>
                        <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Standby Mode</div>
                        <p className="text-[10px] text-slate-500 px-4">No priority requests detected in the current grid network.</p>

                        {detailed && (
                            <div className="mt-8 w-full">
                                <h4 className="text-[10px] text-slate-500 uppercase font-bold text-left mb-4 tracking-tighter">Simulate Emergency Events</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {['North', 'South', 'East', 'West'].map(dir => (
                                        <button
                                            key={dir}
                                            onClick={() => onTrigger(dir)}
                                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Ambulance size={14} className="text-slate-500" />
                                                <span className="text-xs font-medium text-slate-400">{dir} Axis Protocol</span>
                                            </div>
                                            <ChevronRight size={14} className="text-slate-600 group-hover:text-primary" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmergencyPanel;
