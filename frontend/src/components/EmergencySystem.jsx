import React, { memo, useState, useEffect, useRef } from 'react';
import { ShieldAlert, Siren, Timer, AlertTriangle, Zap, Activity, Radio, Cpu } from 'lucide-react';

const CountdownRing = memo(({ eta, maxEta = 15 }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const safeEta = isNaN(eta) ? 0 : eta;
    const progress = safeEta / maxEta;
    const offset = circumference * (1 - progress);

    return (
        <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r={radius} stroke="rgba(220,38,38,0.1)" strokeWidth="3" fill="transparent" />
                <circle
                    cx="32" cy="32" r={radius}
                    stroke="url(#emergencyGradLight)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                />
                <defs>
                    <linearGradient id="emergencyGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#dc2626" />
                        <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-slate-800 font-mono tabular-nums">{safeEta}</span>
                <span className="text-[7px] font-bold text-red-500 uppercase">sec</span>
            </div>
        </div>
    );
});
CountdownRing.displayName = 'CountdownRing';

const EventLogItem = memo(({ message, time, index }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), index * 100);
        return () => clearTimeout(t);
    }, [index]);

    return (
        <div
            className={`flex items-center space-x-2 px-3 py-2 bg-red-50 rounded-lg border border-red-200 transition-all duration-400 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
            style={{ transitionDelay: `${index * 80}ms` }}
        >
            <AlertTriangle size={10} className="text-red-500 flex-shrink-0" />
            <span className="text-[9px] font-bold text-slate-600 flex-1">{message}</span>
            <span className="text-[8px] font-mono text-slate-400">{time}</span>
        </div>
    );
});
EventLogItem.displayName = 'EventLogItem';

const EmergencySystem = ({ emergency, onTrigger }) => {
    const [eventLog, setEventLog] = useState([]);

    useEffect(() => {
        if (emergency) {
            const now = new Date().toLocaleTimeString();
            setEventLog(prev => [
                { message: `Priority override: ${emergency.laneId} lane`, time: now },
                ...prev.slice(0, 4)
            ]);
        }
    }, [emergency?.laneId]);

    return (
        <div className={`glass-vibrant rounded-2xl p-6 relative overflow-hidden transition-all duration-500 ${emergency ? 'border-2 border-red-300 shadow-[0_0_30px_rgba(220,38,38,0.1)]' : ''
            }`}>
            {/* Emergency ambient */}
            <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.06),transparent_70%)] transition-opacity duration-700 pointer-events-none ${emergency ? 'opacity-100' : 'opacity-0'
                }`} />

            {emergency && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 emergency-flash" />
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl border transition-all duration-700 ${emergency
                            ? 'bg-red-100 border-red-300 shadow-[0_0_15px_rgba(220,38,38,0.15)]'
                            : 'bg-slate-100 border-slate-200'
                        }`}>
                        <ShieldAlert size={22} className={emergency ? 'text-red-500' : 'text-slate-400'} />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Command Override</h3>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${emergency ? 'bg-red-500 animate-ping' : 'bg-slate-300'}`} />
                            <p className="text-[8px] text-slate-400 font-mono font-bold uppercase tracking-[0.2em]">Priority Control</p>
                        </div>
                    </div>
                </div>
                {emergency && (
                    <div className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 emergency-flash">
                        <Radio size={12} className="text-red-500" />
                        <span className="text-[9px] font-black text-red-500 uppercase tracking-wider">Active</span>
                    </div>
                )}
            </div>

            <div className="relative z-10">
                {emergency ? (
                    <div className="space-y-4">
                        <div className="relative rounded-xl p-5 bg-red-50/50 border border-red-200 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-100/30 to-transparent pointer-events-none" />
                            <div className="flex items-center space-x-5 relative z-10">
                                <CountdownRing eta={emergency.eta || 0} />
                                <div className="space-y-1.5">
                                    <div className="flex items-center space-x-2">
                                        <Siren size={14} className="text-red-500" />
                                        <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.3em] font-mono">Priority Clear</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">{emergency.laneId} Lane</h2>
                                    <span className="text-[9px] text-slate-500 font-bold uppercase">{emergency.type || 'Emergency'} Unit</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-white/60 rounded-xl border border-slate-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Timer size={14} className="text-red-500" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">ETA</span>
                                </div>
                                <div className="text-2xl font-black text-slate-800 font-mono tabular-nums">
                                    {emergency.eta || 0}<span className="text-sm text-red-500 ml-1">s</span>
                                </div>
                            </div>
                            <div className="p-4 bg-white/60 rounded-xl border border-slate-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Cpu size={14} className="text-emerald-500" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Signal</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-sm font-black text-slate-800 uppercase">Green Lock</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Event Feed</span>
                            {eventLog.map((evt, i) => (
                                <EventLogItem key={`${evt.time}-${i}`} {...evt} index={i} />
                            ))}
                        </div>

                        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                            <p className="text-[9px] text-red-500/70 font-bold uppercase tracking-wide">
                                <span className="text-slate-700">SYS:</span> All conflicting signals overridden. Corridor secured for priority passage.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-[-20px] bg-primary/[0.06] rounded-full blur-2xl" />
                            <div className="w-20 h-20 rounded-full border border-slate-200 flex items-center justify-center relative overflow-hidden bg-slate-50">
                                <ShieldAlert size={32} className="text-slate-300" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.06] to-transparent" style={{ animation: 'scan 3s ease-in-out infinite' }} />
                            </div>
                        </div>

                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Radar Active</h4>
                        <p className="text-[9px] text-slate-400 max-w-[200px] font-bold uppercase tracking-wider leading-loose mb-6">
                            Grid integrity <span className="text-primary">100%</span>. No emergency vectors detected.
                        </p>

                        <div className="grid grid-cols-2 gap-2 w-full">
                            {['North', 'South', 'East', 'West'].map(lane => (
                                <button
                                    key={lane}
                                    onClick={() => onTrigger(lane)}
                                    className="ripple-effect px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300 active:scale-95"
                                >
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                        {lane}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(EmergencySystem);
