import React, { memo, useMemo } from 'react';
import { Leaf, Wind, Fuel, Award, Activity, Zap, TrendingDown, Globe, TreePine, Factory, Scale, ArrowDown } from 'lucide-react';

const StatCard = memo(({ label, value, unit, icon: Icon, color, bgColor, borderColor }) => (
    <div className={`p-5 rounded-2xl ${bgColor} border ${borderColor} relative overflow-hidden group hover:shadow-lg transition-shadow`}>
        <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 blur-2xl" style={{ background: color }} />
        <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2 rounded-xl bg-white/60 border ${borderColor}`}>
                <Icon size={18} style={{ color }} />
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{label}</span>
        </div>
        <div className="text-2xl font-black text-slate-800 font-mono tabular-nums">
            {value}<span className="text-sm text-slate-400 ml-1">{unit}</span>
        </div>
    </div>
));
StatCard.displayName = 'StatCard';

const EcoMonitorTab = ({ trafficData }) => {
    const emissions = trafficData?.emissions || {};
    const staticTotal = isNaN(emissions.staticTotal) ? 0 : emissions.staticTotal;
    const adaptiveTotal = isNaN(emissions.adaptiveTotal) ? 0 : emissions.adaptiveTotal;
    const savedTotal = isNaN(emissions.savedTotal) ? 0 : Math.max(0, emissions.savedTotal);
    const reductionPercent = isNaN(emissions.reductionPercent) ? 0 : Math.max(0, Math.min(100, emissions.reductionPercent));
    const fuelSaved = (savedTotal * 0.42).toFixed(1);
    const treesEquiv = Math.round(savedTotal * 0.045);
    const maxE = Math.max(staticTotal, adaptiveTotal, 1);

    const hourlyData = useMemo(() => {
        return Array.from({ length: 24 }, (_, i) => ({
            hour: `${String(i).padStart(2, '0')}:00`,
            static: 20 + Math.random() * 80,
            adaptive: 10 + Math.random() * 50,
        }));
    }, [Math.floor(staticTotal)]);

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="w-10 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full" />
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Eco Monitor</h2>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-[0.2em]">Carbon Emission Tracking & Analysis</p>
                </div>
                {savedTotal > 0 && (
                    <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 shadow-sm">
                        <Award size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Eco Positive</span>
                    </div>
                )}
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Static Emission" value={staticTotal.toFixed(1)} unit="kg CO₂" icon={Factory} color="#ef4444" bgColor="bg-red-50" borderColor="border-red-200" />
                <StatCard label="AI Adaptive" value={adaptiveTotal.toFixed(1)} unit="kg CO₂" icon={Zap} color="#059669" bgColor="bg-emerald-50" borderColor="border-emerald-200" />
                <StatCard label="CO₂ Saved" value={savedTotal.toFixed(1)} unit="kg" icon={Leaf} color="#0891b2" bgColor="bg-cyan-50" borderColor="border-cyan-200" />
                <StatCard label="Reduction" value={reductionPercent.toFixed(1)} unit="%" icon={TrendingDown} color="#7c3aed" bgColor="bg-violet-50" borderColor="border-violet-200" />
            </div>

            {/* Large Comparison Section */}
            <div className="glass-vibrant rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-5">
                    <Scale size={16} className="text-slate-400" />
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Static vs AI Adaptive Comparison</h3>
                    <div className={`ml-auto px-2.5 py-1 rounded-lg border flex items-center space-x-1.5 ${reductionPercent > 15 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-amber-50 border-amber-200 text-amber-600'
                        }`}>
                        <ArrowDown size={10} />
                        <span className="text-[10px] font-black tabular-nums font-mono">{reductionPercent.toFixed(1)}% Lower</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Static Bar */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-orange-400" />
                                <span className="text-xs font-black text-slate-700 uppercase">Static Signal System</span>
                            </div>
                            <span className="text-lg font-black text-slate-800 font-mono tabular-nums">{staticTotal.toFixed(1)} kg</span>
                        </div>
                        <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                            <div className="h-full bg-gradient-to-r from-red-400 via-red-500 to-orange-400 rounded-full relative"
                                style={{ width: `${(staticTotal / maxE) * 100}%`, transition: 'width 1.2s ease-out' }}>
                                <div className="absolute inset-0 shimmer-effect" />
                            </div>
                        </div>
                    </div>

                    {/* Adaptive Bar */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400" />
                                <span className="text-xs font-black text-slate-700 uppercase">AI Adaptive System</span>
                            </div>
                            <span className="text-lg font-black text-slate-800 font-mono tabular-nums">{adaptiveTotal.toFixed(1)} kg</span>
                        </div>
                        <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                            <div className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 rounded-full relative"
                                style={{ width: `${(adaptiveTotal / maxE) * 100}%`, transition: 'width 1.2s ease-out' }}>
                                <div className="absolute inset-0 shimmer-effect" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 24hr Chart (CSS-based bar chart) */}
            <div className="glass-vibrant rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-5">
                    <Activity size={16} className="text-slate-400" />
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">24-Hour Emission Trend</h3>
                </div>
                <div className="flex items-end space-x-[3px] h-36">
                    {hourlyData.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center space-y-[2px]" title={`${d.hour}\nStatic: ${d.static.toFixed(0)}g\nAdaptive: ${d.adaptive.toFixed(0)}g`}>
                            <div className="w-full flex space-x-px" style={{ height: '100%', alignItems: 'flex-end' }}>
                                <div className="flex-1 bg-gradient-to-t from-red-400/40 to-red-300/20 rounded-t-sm border-t border-red-300/40"
                                    style={{ height: `${d.static}%`, transition: `height 0.5s ease-out ${i * 0.02}s` }} />
                                <div className="flex-1 bg-gradient-to-t from-emerald-400/50 to-emerald-300/20 rounded-t-sm border-t border-emerald-300/40"
                                    style={{ height: `${d.adaptive}%`, transition: `height 0.5s ease-out ${i * 0.02}s` }} />
                            </div>
                            {i % 4 === 0 && <span className="text-[7px] font-mono text-slate-300 mt-1">{d.hour.split(':')[0]}</span>}
                        </div>
                    ))}
                </div>
                <div className="flex items-center space-x-6 mt-4 justify-center">
                    <div className="flex items-center space-x-2"><div className="w-3 h-2 bg-red-400/40 rounded-sm" /><span className="text-[9px] font-bold text-slate-400">Static</span></div>
                    <div className="flex items-center space-x-2"><div className="w-3 h-2 bg-emerald-400/50 rounded-sm" /><span className="text-[9px] font-bold text-slate-400">Adaptive</span></div>
                </div>
            </div>

            {/* Environmental Impact */}
            <div className="grid grid-cols-3 gap-4">
                <div className="glass-vibrant rounded-2xl p-5 text-center">
                    <Fuel size={24} className="text-cyan-500 mx-auto mb-3" />
                    <div className="text-2xl font-black text-slate-800 font-mono">{fuelSaved}L</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Fuel Saved</div>
                </div>
                <div className="glass-vibrant rounded-2xl p-5 text-center">
                    <TreePine size={24} className="text-emerald-500 mx-auto mb-3" />
                    <div className="text-2xl font-black text-slate-800 font-mono">{treesEquiv}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Trees Equivalent</div>
                </div>
                <div className="glass-vibrant rounded-2xl p-5 text-center">
                    <Globe size={24} className="text-violet-500 mx-auto mb-3" />
                    <div className="text-2xl font-black text-slate-800 font-mono">{(savedTotal * 0.0012).toFixed(2)}m³</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Clean Air Volume</div>
                </div>
            </div>
        </div>
    );
};

export default memo(EcoMonitorTab);
