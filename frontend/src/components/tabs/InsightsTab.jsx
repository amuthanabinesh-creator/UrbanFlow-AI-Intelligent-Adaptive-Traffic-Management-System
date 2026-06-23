import React, { memo, useMemo } from 'react';
import { BarChart3, TrendingUp, Clock, Users, Zap, Activity, ArrowUpRight, ArrowDownRight, Gauge, Target, Cpu, Network } from 'lucide-react';

const MiniChart = memo(({ data, color, height = 48 }) => {
    const max = Math.max(...data, 1);
    return (
        <div className="flex items-end space-x-[2px]" style={{ height }}>
            {data.map((v, i) => (
                <div key={i} className="flex-1 rounded-t-sm" style={{
                    height: `${(v / max) * 100}%`,
                    background: `linear-gradient(to top, ${color}40, ${color}15)`,
                    borderTop: `1px solid ${color}50`,
                    transition: `height 0.6s ease-out ${i * 0.03}s`,
                }} />
            ))}
        </div>
    );
});
MiniChart.displayName = 'MiniChart';

const InsightsTab = ({ trafficData }) => {
    const lanes = trafficData?.lanes || [];
    const stats = trafficData?.stats || {};
    const totalVehicles = lanes.reduce((s, l) => s + (l.vehicleCount || 0), 0);
    const avgWait = stats.avgWaitingTime || 0;
    const throughput = totalVehicles * 2.3;

    const hourlyFlow = useMemo(() => Array.from({ length: 20 }, () => 30 + Math.random() * 70), [totalVehicles]);
    const waitTrend = useMemo(() => Array.from({ length: 20 }, () => 10 + Math.random() * 50), [avgWait]);
    const densityTrend = useMemo(() => Array.from({ length: 20 }, () => 15 + Math.random() * 60), [lanes[0]?.density]);

    const lanePerformance = lanes.map(l => ({
        name: l.id,
        vehicles: l.vehicleCount || 0,
        density: l.density || 0,
        wait: l.avgWait || Math.round(Math.random() * 30 + 5),
        throughput: Math.round((l.vehicleCount || 0) * 2.1),
        grade: l.density < 0.3 ? 'A' : l.density < 0.5 ? 'B' : l.density < 0.7 ? 'C' : 'D',
    }));

    const gradeColor = (g) => g === 'A' ? 'text-emerald-500 bg-emerald-50 border-emerald-200' : g === 'B' ? 'text-blue-500 bg-blue-50 border-blue-200' : g === 'C' ? 'text-amber-500 bg-amber-50 border-amber-200' : 'text-red-500 bg-red-50 border-red-200';

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="w-10 h-1.5 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-400 rounded-full" />
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">System Insights</h2>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em]">Performance Analytics & Traffic Intelligence</p>
                </div>
            </div>

            {/* Metric Cards with mini charts */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Throughput', value: `${throughput.toFixed(0)}`, unit: 'v/hr', trend: '+12%', up: true, data: hourlyFlow, color: '#3b82f6', icon: TrendingUp },
                    { label: 'Avg Wait Time', value: avgWait.toFixed(1), unit: 'sec', trend: '-8%', up: false, data: waitTrend, color: '#f59e0b', icon: Clock },
                    { label: 'Grid Density', value: `${Math.round((lanes.reduce((s, l) => s + (l.density || 0), 0) / (lanes.length || 1)) * 100)}`, unit: '%', trend: '-3%', up: false, data: densityTrend, color: '#8b5cf6', icon: Gauge },
                ].map(m => (
                    <div key={m.label} className="glass-vibrant rounded-2xl p-5 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                                <m.icon size={16} style={{ color: m.color }} />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{m.label}</span>
                            </div>
                            <div className={`flex items-center space-x-1 text-[10px] font-black ${m.up ? 'text-emerald-500' : 'text-red-500'}`}>
                                {m.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                <span>{m.trend}</span>
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-800 font-mono tabular-nums mb-3">
                            {m.value}<span className="text-sm text-slate-400 ml-1">{m.unit}</span>
                        </div>
                        <MiniChart data={m.data} color={m.color} />
                    </div>
                ))}
            </div>

            {/* Lane Performance Table */}
            <div className="glass-vibrant rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-5">
                    <Target size={16} className="text-slate-400" />
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Lane Performance</h3>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200/60">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200/60">
                                {['Lane', 'Vehicles', 'Density', 'Avg Wait', 'Throughput', 'Grade'].map(h => (
                                    <th key={h} className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-wider text-left">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {lanePerformance.map((lp, i) => (
                                <tr key={lp.name} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white/40' : 'bg-white/20'} hover:bg-slate-50 transition-colors`}>
                                    <td className="px-4 py-3 text-xs font-black text-slate-700 uppercase">{lp.name}</td>
                                    <td className="px-4 py-3 text-sm font-bold text-slate-600 font-mono tabular-nums">{lp.vehicles}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${lp.density > 0.7 ? 'bg-red-400' : lp.density > 0.4 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                                    style={{ width: `${lp.density * 100}%` }} />
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-400">{Math.round(lp.density * 100)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-bold text-slate-600 font-mono tabular-nums">{lp.wait}s</td>
                                    <td className="px-4 py-3 text-sm font-bold text-slate-600 font-mono tabular-nums">{lp.throughput}/hr</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 rounded-lg border text-xs font-black ${gradeColor(lp.grade)}`}>{lp.grade}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* System metrics */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'AI Decisions', value: '2,847', icon: Cpu, color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' },
                    { label: 'Network Nodes', value: '4', icon: Network, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
                    { label: 'Optimizations', value: '156', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
                    { label: 'Uptime', value: '99.98%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                ].map(s => (
                    <div key={s.label} className={`p-4 rounded-xl ${s.bg} border ${s.border} flex items-center space-x-3`}>
                        <s.icon size={20} className={s.color} />
                        <div>
                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</div>
                            <div className="text-lg font-black text-slate-800 font-mono tabular-nums">{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default memo(InsightsTab);
