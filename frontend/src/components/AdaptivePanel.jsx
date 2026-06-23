import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Activity, TrendingUp } from 'lucide-react';

const AdaptivePanel = ({ lane, countdown, detailed = false, allLanes = [] }) => {
    if (!lane) return null;

    return (
        <div className={`glass rounded-2xl p-6 ${detailed ? 'h-full' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Activity size={18} className="text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Adaptive Timer</h3>
                </div>
                <div className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold border border-primary/30">
                    AUTO-SYNCED
                </div>
            </div>

            <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-bold text-white font-mono">{countdown}</span>
                <span className="text-xs text-slate-500 uppercase tracking-tighter">Sec Remaining</span>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400 capitalize">Active Lane: {lane.id}</span>
                        <span className="text-white font-bold">{lane.vehicleCount} Vehicles</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${lane.density * 100}%` }}
                            className={`h-full ${lane.density > 0.7 ? 'bg-secondary' : lane.density > 0.4 ? 'bg-warning' : 'bg-primary'}`}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] text-slate-500 uppercase mb-1">Calculated Green</div>
                        <div className="text-lg font-bold text-white font-mono">{lane.greenTime}s</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-[10px] text-slate-500 uppercase mb-1">Congestion</div>
                        <div className={`text-lg font-bold ${lane.congestion === 'High' ? 'text-secondary' : 'text-primary'}`}>
                            {lane.congestion}
                        </div>
                    </div>
                </div>

                {detailed && allLanes.length > 0 && (
                    <div className="mt-8">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Network Density Matrix</h4>
                        <div className="space-y-4">
                            {allLanes.map(l => (
                                <div key={l.id} className="flex items-center space-x-4">
                                    <span className="text-[10px] font-mono text-slate-500 w-12">{l.id}</span>
                                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div animate={{ width: `${l.density * 100}%` }} className="h-full bg-accent/40" />
                                    </div>
                                    <span className="text-[10px] font-bold text-white">{Math.round(l.density * 100)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdaptivePanel;
