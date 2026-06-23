import React, { memo, useMemo, useState } from 'react';
import { Zap, Clock, Gauge, ArrowUpDown, BarChart3, Activity, Settings, TrendingUp, Layers, RefreshCw, Timer, Radio } from 'lucide-react';

/**
 * AdaptiveLayerTab — Shows adaptive signal timing controls and phase optimization.
 */
const PhaseCard = memo(({ lane, phase, greenTime, cycle, isActive, density }) => {
    const densityColor = density > 0.7 ? 'text-red-500 bg-red-50' : density > 0.4 ? 'text-amber-500 bg-amber-50' : 'text-emerald-500 bg-emerald-50';
    const densityBorder = density > 0.7 ? 'border-red-200' : density > 0.4 ? 'border-amber-200' : 'border-emerald-200';

    return (
        <div className={`glass-vibrant rounded-2xl p-5 relative overflow-hidden transition-all duration-500 ${isActive ? 'ring-2 ring-primary/30 shadow-lg shadow-primary/5' : ''
            }`}>
            {isActive && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl ${isActive ? 'bg-primary/15 text-primary' : 'bg-slate-100 text-slate-400'} border ${isActive ? 'border-primary/25' : 'border-slate-200'}`}>
                        <Radio size={18} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{lane} Lane</h4>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Phase {phase}</span>
                    </div>
                </div>
                {isActive && (
                    <div className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                        <span className="text-[9px] font-black text-primary uppercase tracking-wider animate-pulse">Active</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-3 bg-white/50 rounded-xl border border-slate-200/60 text-center">
                    <div className="text-[8px] font-bold text-slate-400 uppercase mb-1">Green</div>
                    <div className="text-lg font-black text-slate-800 font-mono tabular-nums">{greenTime}<span className="text-[10px] text-slate-400">s</span></div>
                </div>
                <div className="p-3 bg-white/50 rounded-xl border border-slate-200/60 text-center">
                    <div className="text-[8px] font-bold text-slate-400 uppercase mb-1">Cycle</div>
                    <div className="text-lg font-black text-slate-800 font-mono tabular-nums">{cycle}<span className="text-[10px] text-slate-400">s</span></div>
                </div>
                <div className={`p-3 rounded-xl border ${densityBorder} text-center ${densityColor.split(' ')[1]}`}>
                    <div className="text-[8px] font-bold text-slate-400 uppercase mb-1">Density</div>
                    <div className={`text-lg font-black font-mono tabular-nums ${densityColor.split(' ')[0]}`}>{Math.round(density * 100)}%</div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex-1 min-w-[120px]">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.max(5, greenTime / 60 * 100)}%` }}
                        />
                    </div>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase ml-3">AI Optimized</span>
            </div>
        </div>
    );
});
PhaseCard.displayName = 'PhaseCard';

const AdaptiveLayerTab = ({ trafficData }) => {
    if (!trafficData) return null;
    const { lanes, activeLaneIndex, countdown } = trafficData;

    const totalVehicles = lanes?.reduce((sum, l) => sum + (l.vehicleCount || 0), 0) || 0;
    const avgDensity = lanes?.reduce((sum, l) => sum + (l.density || 0), 0) / (lanes?.length || 1);

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="w-10 h-1.5 bg-gradient-to-r from-violet-500 via-primary to-cyan-400 rounded-full" />
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Adaptive Layer</h2>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em]">Real-Time Signal Phase Optimization</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="px-4 py-2 bg-white/70 border border-slate-200 rounded-xl flex items-center space-x-2">
                        <Gauge size={14} className="text-primary" />
                        <span className="text-[10px] font-black text-slate-600 uppercase">Mode: AI Auto</span>
                    </div>
                </div>
            </div>

            {/* Global Stats Bar */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Active Vehicles', value: totalVehicles, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
                    { label: 'Avg Density', value: `${Math.round(avgDensity * 100)}%`, icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
                    { label: 'Phase Timer', value: `${countdown}s`, icon: Timer, color: 'text-primary', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                    { label: 'Optimization', value: 'Active', icon: RefreshCw, color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' },
                ].map((stat) => (
                    <div key={stat.label} className={`p-4 rounded-xl ${stat.bg} border ${stat.border} flex items-center space-x-3`}>
                        <stat.icon size={20} className={stat.color} />
                        <div>
                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
                            <div className="text-lg font-black text-slate-800 font-mono tabular-nums">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Phase Cards Grid */}
            <div>
                <div className="flex items-center space-x-2 mb-4">
                    <Layers size={16} className="text-slate-400" />
                    <h3 className="text-sm font-black text-slate-600 uppercase tracking-wider">Signal Phases</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {lanes?.map((lane, idx) => (
                        <PhaseCard
                            key={lane.id}
                            lane={lane.id}
                            phase={idx + 1}
                            greenTime={lane.greenTime || 30}
                            cycle={lane.cycleLength || 120}
                            isActive={idx === activeLaneIndex}
                            density={lane.density || 0}
                        />
                    ))}
                </div>
            </div>

            {/* Algorithm Info */}
            <div className="glass-vibrant rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2.5 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl border border-violet-200">
                        <Settings size={18} className="text-violet-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Optimization Engine</h3>
                        <p className="text-[8px] text-slate-400 font-mono uppercase tracking-wider">Webster-Cobbe + AI Reinforcement</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Algorithm', value: 'Webster-Cobbe', detail: 'Cycle Length' },
                        { label: 'Learning Rate', value: '0.003', detail: 'RL Agent' },
                        { label: 'Update Freq', value: '1 Hz', detail: 'Real-time' },
                    ].map(item => (
                        <div key={item.label} className="p-3 bg-white/50 rounded-xl border border-slate-200/60">
                            <div className="text-[8px] font-bold text-slate-400 uppercase mb-1">{item.label}</div>
                            <div className="text-sm font-black text-slate-800 font-mono">{item.value}</div>
                            <div className="text-[8px] text-slate-400 mt-0.5">{item.detail}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(AdaptiveLayerTab);
