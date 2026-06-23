import React, { memo, useState, useMemo, useEffect } from 'react';
import { History, Clock, AlertTriangle, CheckCircle2, ShieldAlert, Zap, Activity, RefreshCw, Shield, Filter, ChevronDown } from 'lucide-react';

const eventTypes = [
    { type: 'phase_change', icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    { type: 'emergency', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    { type: 'optimization', icon: Zap, color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' },
    { type: 'system', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
];

const generateEvents = (trafficData) => {
    const lanes = trafficData?.lanes || [];
    const now = new Date();
    const events = [];

    // Generate realistic event history
    for (let i = 0; i < 30; i++) {
        const time = new Date(now - i * (15000 + Math.random() * 45000));
        const typeIdx = Math.random() < 0.05 ? 1 : Math.random() < 0.3 ? 2 : Math.random() < 0.6 ? 0 : 3;
        const lane = lanes[Math.floor(Math.random() * lanes.length)];

        const messages = {
            0: [`Phase change: ${lane?.id || 'North'} lane activated`, `Green time: ${Math.round(20 + Math.random() * 20)}s`],
            1: [`Emergency override: ${lane?.id || 'East'} lane`, `Vehicle cleared in ${Math.round(5 + Math.random() * 10)}s`],
            2: [`AI optimization: Adjusted ${lane?.id || 'South'} timing`, `Throughput improved by ${Math.round(5 + Math.random() * 15)}%`],
            3: [`System health check passed`, `All ${lanes.length || 4} nodes operational`],
        };

        events.push({
            id: i,
            timestamp: time.toLocaleTimeString(),
            date: time.toLocaleDateString(),
            ...eventTypes[typeIdx],
            message: messages[typeIdx][0],
            detail: messages[typeIdx][1],
            severity: typeIdx === 1 ? 'High' : typeIdx === 2 ? 'Medium' : 'Low',
        });
    }
    return events;
};

const AuditLogTab = ({ trafficData }) => {
    const [filter, setFilter] = useState('all');
    const [expanded, setExpanded] = useState(null);

    const events = useMemo(() => generateEvents(trafficData), [trafficData?.activeLaneIndex]);

    const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);

    const counts = useMemo(() => ({
        all: events.length,
        phase_change: events.filter(e => e.type === 'phase_change').length,
        emergency: events.filter(e => e.type === 'emergency').length,
        optimization: events.filter(e => e.type === 'optimization').length,
        system: events.filter(e => e.type === 'system').length,
    }), [events]);

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="w-10 h-1.5 bg-gradient-to-r from-slate-500 via-slate-400 to-slate-300 rounded-full" />
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Audit Log</h2>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em]">System Event History & Activity Feed</p>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                    <Clock size={12} />
                    <span>{events.length} events recorded</span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 overflow-x-auto">
                {[
                    { id: 'all', label: 'All Events', icon: Filter },
                    { id: 'phase_change', label: 'Phase Changes', icon: RefreshCw },
                    { id: 'emergency', label: 'Emergency', icon: ShieldAlert },
                    { id: 'optimization', label: 'Optimizations', icon: Zap },
                    { id: 'system', label: 'System', icon: Activity },
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border whitespace-nowrap transition-all duration-300 ${filter === f.id
                                ? 'bg-primary/10 border-primary/20 text-primary shadow-sm'
                                : 'bg-white/50 border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        <f.icon size={14} />
                        <span className="text-[10px] font-black uppercase tracking-wider">{f.label}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black ${filter === f.id ? 'bg-primary/20 text-primary' : 'bg-slate-100 text-slate-400'
                            }`}>{counts[f.id]}</span>
                    </button>
                ))}
            </div>

            {/* Event Summary */}
            <div className="grid grid-cols-4 gap-3">
                {eventTypes.map(et => (
                    <div key={et.type} className={`p-3 rounded-xl ${et.bg} border ${et.border} flex items-center space-x-3`}>
                        <et.icon size={18} className={et.color} />
                        <div>
                            <div className="text-lg font-black text-slate-800 font-mono tabular-nums">{counts[et.type]}</div>
                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{et.type.replace('_', ' ')}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Event Feed */}
            <div className="glass-vibrant rounded-2xl p-6">
                <div className="space-y-2">
                    {filtered.map((evt, i) => {
                        const IconComp = evt.icon;
                        const isExpanded = expanded === evt.id;
                        return (
                            <div
                                key={evt.id}
                                className={`flex items-center p-3.5 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-sm ${evt.bg}/30 ${evt.border}/50 hover:${evt.bg}`}
                                onClick={() => setExpanded(isExpanded ? null : evt.id)}
                                style={{ opacity: 1, animation: `fadeIn 0.3s ease-out ${i * 0.02}s both` }}
                            >
                                <div className={`p-2 rounded-lg ${evt.bg} border ${evt.border} mr-3 flex-shrink-0`}>
                                    <IconComp size={14} className={evt.color} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs font-black text-slate-700 truncate">{evt.message}</span>
                                    </div>
                                    {isExpanded && (
                                        <p className="text-[10px] text-slate-400 font-bold mt-1">{evt.detail}</p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-3 flex-shrink-0 ml-3">
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${evt.severity === 'High' ? 'bg-red-100 text-red-600' :
                                            evt.severity === 'Medium' ? 'bg-amber-100 text-amber-600' :
                                                'bg-slate-100 text-slate-500'
                                        }`}>{evt.severity}</span>
                                    <span className="text-[9px] font-mono text-slate-400">{evt.timestamp}</span>
                                    <ChevronDown size={12} className={`text-slate-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default memo(AuditLogTab);
