import React, { memo, useState, useEffect, useMemo } from 'react';
import { ShieldAlert, Siren, AlertTriangle, Shield, Clock, MapPin, Radio, CheckCircle2, XCircle, Timer, Activity, Zap } from 'lucide-react';

const PriorityControlTab = ({ trafficData, onTrigger }) => {
    const emergency = trafficData?.emergencyVehicle;
    const isActive = trafficData?.isEmergencyActive;
    const [history, setHistory] = useState([
        { id: 1, lane: 'North', type: 'Ambulance', time: '23:12:45', status: 'Resolved', duration: '8s' },
        { id: 2, lane: 'East', type: 'Fire Truck', time: '22:58:12', status: 'Resolved', duration: '12s' },
        { id: 3, lane: 'West', type: 'Police', time: '22:41:33', status: 'Resolved', duration: '6s' },
    ]);

    useEffect(() => {
        if (emergency) {
            setHistory(prev => [{
                id: Date.now(), lane: emergency.laneId, type: emergency.type || 'Emergency',
                time: new Date().toLocaleTimeString(), status: 'Active', duration: `${emergency.eta}s`
            }, ...prev.slice(0, 9)]);
        }
    }, [emergency?.laneId]);

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="w-10 h-1.5 bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 rounded-full" />
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Priority Control</h2>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em]">Emergency Vehicle Override System</p>
                </div>
                <div className={`px-4 py-2 rounded-xl border flex items-center space-x-2 ${isActive ? 'bg-red-50 border-red-200 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'bg-emerald-50 border-emerald-200'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-red-600' : 'text-emerald-600'}`}>
                        {isActive ? 'Emergency Active' : 'All Clear'}
                    </span>
                </div>
            </div>

            {/* Current Status */}
            {isActive && emergency ? (
                <div className="glass-vibrant rounded-2xl p-6 border-2 border-red-200 shadow-lg shadow-red-500/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 emergency-flash" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.04),transparent_70%)] pointer-events-none" />
                    <div className="flex items-center space-x-6 relative z-10">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                                <circle cx="32" cy="32" r="28" stroke="rgba(220,38,38,0.1)" strokeWidth="3" fill="transparent" />
                                <circle cx="32" cy="32" r="28" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" fill="transparent"
                                    strokeDasharray={176} strokeDashoffset={176 * (1 - (emergency.eta || 0) / 15)}
                                    style={{ transition: 'stroke-dashoffset 0.8s ease-out' }} />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-slate-800 font-mono">{emergency.eta || 0}</span>
                                <span className="text-[7px] font-bold text-red-500 uppercase">sec</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Siren size={16} className="text-red-500" />
                                <span className="text-xs font-black text-red-500 uppercase tracking-widest font-mono">Priority Override</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">{emergency.laneId} Lane</h3>
                            <p className="text-sm text-slate-500 font-bold">{emergency.type || 'Emergency'} vehicle approaching — corridor secured</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass-vibrant rounded-2xl p-8 text-center">
                    <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
                        <Shield size={32} className="text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-black text-slate-700 uppercase mb-1">Grid Secure</h3>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">No active emergency detections in grid network</p>
                </div>
            )}

            {/* Trigger Buttons */}
            <div className="glass-vibrant rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Radio size={16} className="text-slate-400" />
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Manual Override</h3>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {['North', 'South', 'East', 'West'].map(lane => (
                        <button
                            key={lane}
                            onClick={() => onTrigger(lane)}
                            className="p-5 rounded-xl bg-white/60 border border-slate-200 hover:bg-red-50 hover:border-red-300 hover:shadow-md transition-all duration-300 active:scale-95 text-center group"
                        >
                            <Siren size={24} className="text-slate-300 group-hover:text-red-500 transition-colors mx-auto mb-2" />
                            <span className="text-xs font-black text-slate-500 group-hover:text-red-600 uppercase tracking-widest transition-colors">{lane}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* History */}
            <div className="glass-vibrant rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Clock size={16} className="text-slate-400" />
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Override History</h3>
                </div>
                <div className="space-y-2">
                    {history.map((evt, i) => (
                        <div key={evt.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${evt.status === 'Active' ? 'bg-red-50 border-red-200' : 'bg-white/50 border-slate-200/60'
                            }`}>
                            <div className="flex items-center space-x-3">
                                {evt.status === 'Active'
                                    ? <AlertTriangle size={14} className="text-red-500 animate-pulse" />
                                    : <CheckCircle2 size={14} className="text-emerald-500" />}
                                <div>
                                    <span className="text-xs font-black text-slate-700 uppercase">{evt.lane} — {evt.type}</span>
                                    <span className="text-[8px] text-slate-400 font-mono ml-2">{evt.time}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-[9px] font-mono font-bold text-slate-400">{evt.duration}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${evt.status === 'Active' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                                    }`}>{evt.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(PriorityControlTab);
