import React, { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, ShieldAlert, BarChart3, Wind,
    LayoutDashboard, Settings, History, Bell,
    Cpu, Box, Globe, Zap
} from 'lucide-react';

import IntersectionCanvas from './components/IntersectionCanvas';
import KPICards from './components/KPICards';
import CO2Comparison from './components/CO2Comparison';
import EmergencySystem from './components/EmergencySystem';
import AISuggestionsPanel from './components/AISuggestionsPanel';
import AdaptiveLayerTab from './components/tabs/AdaptiveLayerTab';
import EcoMonitorTab from './components/tabs/EcoMonitorTab';
import PriorityControlTab from './components/tabs/PriorityControlTab';
import InsightsTab from './components/tabs/InsightsTab';
import AuditLogTab from './components/tabs/AuditLogTab';

const socket = io('http://localhost:5100');

function App() {
    const [trafficData, setTrafficData] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isLive, setIsLive] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const prevDataRef = useRef(null);

    useEffect(() => {
        const update = () => setCurrentTime(new Date().toLocaleTimeString());
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const handleUpdate = (data) => {
            const prev = prevDataRef.current;
            if (prev &&
                prev.activeLaneIndex === data.activeLaneIndex &&
                prev.countdown === data.countdown &&
                prev.isEmergencyActive === data.isEmergencyActive &&
                prev.lanes?.[0]?.vehicleCount === data.lanes?.[0]?.vehicleCount &&
                prev.lanes?.[2]?.vehicleCount === data.lanes?.[2]?.vehicleCount
            ) {
                return;
            }
            prevDataRef.current = data;
            setTrafficData(data);
        };

        socket.on('trafficUpdate', handleUpdate);
        socket.on('connect', () => setIsLive(true));
        socket.on('disconnect', () => setIsLive(false));

        return () => {
            socket.off('trafficUpdate', handleUpdate);
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    const triggerEmergency = useCallback((laneId) => {
        socket.emit('triggerEmergency', laneId);
    }, []);

    if (!trafficData) return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#f0f4f8]">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu size={20} className="text-primary animate-pulse" />
                </div>
            </div>
            <div className="mt-6 text-slate-400 font-mono text-[10px] tracking-[0.4em] animate-pulse uppercase">
                Initializing Grid Mesh
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#f0f4f8] text-slate-700 overflow-hidden font-sans selection:bg-primary/20">
            {/* ========== Sidebar ========== */}
            <aside className="w-64 border-r border-slate-200/80 bg-white/80 backdrop-blur-xl flex flex-col z-50">
                <div className="p-6 pb-8">
                    <div className="flex items-center space-x-2.5 mb-1">
                        <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                            <Cpu size={18} className="text-primary" />
                        </div>
                        <h1 className="text-xl font-black bg-gradient-to-br from-slate-800 to-slate-500 bg-clip-text text-transparent tracking-tighter">
                            Urban<span className="text-primary">Flow</span>
                        </h1>
                    </div>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.25em] pl-0.5">Adaptive Intelligence Grid</p>
                </div>

                <nav className="flex-1 px-3 space-y-0.5">
                    {[
                        { id: 'dashboard', icon: LayoutDashboard, label: 'Central Hub' },
                        { id: 'adaptive', icon: Zap, label: 'Adaptive Layer' },
                        { id: 'co2', icon: Globe, label: 'Eco Monitor' },
                        { id: 'emergency', icon: ShieldAlert, label: 'Priority Ctrl' },
                        { id: 'analytics', icon: BarChart3, label: 'Insights' },
                        { id: 'history', icon: History, label: 'Audit Log' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${activeTab === item.id
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                : 'hover:bg-slate-100 text-slate-500 border border-transparent'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon size={16} className={activeTab === item.id ? 'text-primary' : 'group-hover:text-slate-600 transition-colors'} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                            </div>
                            {activeTab === item.id && <div className="w-0.5 h-3 bg-primary rounded-full" />}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200/60">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Uptime</span>
                            <span className="text-[9px] font-mono text-primary font-bold tabular-nums">99.98%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[99.9%] rounded-full" />
                        </div>
                    </div>
                    <p className="mt-2 text-[8px] font-mono text-slate-400 text-center uppercase tracking-widest">v5.4.1 // Stable</p>
                </div>
            </aside>

            {/* ========== Main Content ========== */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(5,150,105,0.04),transparent_60%)] pointer-events-none" />

                {/* Header */}
                <header className="h-16 border-b border-slate-200/60 bg-white/60 backdrop-blur-lg flex items-center justify-between px-8 z-40 flex-shrink-0">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full transition-colors ${isLive ? 'bg-primary shadow-[0_0_6px_rgba(5,150,105,0.4)]' : 'bg-slate-300'}`} />
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500">
                                {isLive ? 'Live' : 'Offline'}
                            </span>
                        </div>
                        <div className="h-3 w-px bg-slate-200" />
                        <div className="flex items-center space-x-1.5 text-[9px] font-mono text-slate-400">
                            <Box size={10} />
                            <span>SC-7742 // Adaptive Mesh</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <AnimatePresence>
                            {trafficData.isEmergencyActive && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="px-3 py-1 bg-red-50 rounded-lg border border-red-200 flex items-center space-x-2"
                                >
                                    <ShieldAlert size={12} className="text-red-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-red-500 uppercase tracking-wider">Priority Active</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <span className="text-xs font-black font-mono text-slate-400 tabular-nums tracking-tight">
                            {currentTime}
                        </span>

                        <button className="relative p-2 text-slate-400 hover:text-slate-700 transition-colors bg-slate-100 rounded-lg border border-slate-200 hover:border-slate-300">
                            <Bell size={16} />
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar relative z-30">
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-12 gap-5 h-full max-w-[1600px] mx-auto">
                            <div className="col-span-12 lg:col-span-8 space-y-5 flex flex-col">
                                <KPICards stats={trafficData.stats} />
                                <IntersectionCanvas
                                    trafficData={trafficData}
                                    onTriggerEmergency={triggerEmergency}
                                />
                            </div>

                            <div className="col-span-12 lg:col-span-4 space-y-5 flex flex-col">
                                <EmergencySystem
                                    emergency={trafficData.emergencyVehicle}
                                    onTrigger={triggerEmergency}
                                />
                                <CO2Comparison emissions={trafficData.emissions} />
                                <div className="flex-1 min-h-0">
                                    <AISuggestionsPanel trafficData={trafficData} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'adaptive' && (
                        <AdaptiveLayerTab trafficData={trafficData} />
                    )}

                    {activeTab === 'co2' && (
                        <EcoMonitorTab trafficData={trafficData} />
                    )}

                    {activeTab === 'emergency' && (
                        <PriorityControlTab trafficData={trafficData} onTrigger={triggerEmergency} />
                    )}

                    {activeTab === 'analytics' && (
                        <InsightsTab trafficData={trafficData} />
                    )}

                    {activeTab === 'history' && (
                        <AuditLogTab trafficData={trafficData} />
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
