import React, { memo, useMemo, useState, useEffect } from 'react';
import { Zap, AlertCircle, Info, CheckCircle2, ArrowRight, Activity, BrainCircuit, Sparkles, TrendingUp, Target } from 'lucide-react';

const ConfidenceMeter = memo(({ value }) => {
    const safe = isNaN(value) ? 0.5 : Math.max(0, Math.min(1, value));
    const pct = safe * 100;
    const color = pct > 75 ? 'from-emerald-500 to-cyan-400' : pct > 50 ? 'from-amber-500 to-amber-400' : 'from-red-500 to-red-400';

    return (
        <div className="flex items-center space-x-2">
            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${pct}%`, transition: 'width 0.8s ease-out' }} />
            </div>
            <span className="text-[8px] font-mono font-bold text-slate-400 tabular-nums">{Math.round(pct)}%</span>
        </div>
    );
});
ConfidenceMeter.displayName = 'ConfidenceMeter';

const SuggestionCard = memo(({ title, description, severity, impact, laneId, confidence, index }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 200 + index * 130);
        return () => clearTimeout(t);
    }, [index]);

    const severityStyles = {
        Critical: 'border-red-200 bg-red-50/60 text-red-600',
        Medium: 'border-amber-200 bg-amber-50/60 text-amber-600',
        Low: 'border-emerald-200 bg-emerald-50/60 text-emerald-600',
    };

    const severityIcons = { Critical: AlertCircle, Medium: Info, Low: CheckCircle2 };
    const Icon = severityIcons[severity] || Info;

    return (
        <div
            className={`group/card p-4 rounded-xl border ${severityStyles[severity] || severityStyles.Low} cursor-pointer relative overflow-hidden transition-all duration-500 hover:translate-x-[-4px] hover:shadow-md ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
            style={{ transition: 'transform 0.4s ease-out, opacity 0.5s ease-out, border-color 0.3s, box-shadow 0.3s' }}
        >
            <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-white/60 border border-current/10 group-hover/card:scale-110 transition-transform">
                        <Icon size={14} />
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <div className={`w-1 h-1 rounded-full ${severity === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-current'}`} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{severity}</span>
                    </div>
                </div>
                <div className="px-2 py-0.5 bg-white/60 rounded-md border border-slate-200">
                    <span className="text-[8px] font-black text-slate-500 font-mono tracking-wide uppercase">{laneId}</span>
                </div>
            </div>

            <h4 className="text-sm font-black text-slate-800 mb-1.5 uppercase tracking-tight">{title}</h4>
            <p className="text-[9px] text-slate-500 font-bold leading-relaxed mb-3 uppercase tracking-wide">{description}</p>

            <ConfidenceMeter value={confidence} />

            <div className="flex items-center justify-between relative z-10 pt-3 mt-3 border-t border-current/10">
                <div className="flex items-center space-x-2">
                    <Sparkles size={10} className="text-primary" />
                    <span className="text-[9px] font-black text-primary uppercase">{impact}</span>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover/card:text-slate-600 group-hover/card:translate-x-1 transition-all" />
            </div>
        </div>
    );
});
SuggestionCard.displayName = 'SuggestionCard';

const AISuggestionsPanel = ({ trafficData }) => {
    const suggestions = useMemo(() => {
        if (!trafficData?.lanes) return [];
        const items = [];
        const lanes = trafficData.lanes;
        const highCongestion = lanes.filter(l => l.density > 0.6);
        const lowCongestion = lanes.filter(l => l.density < 0.3);

        if (highCongestion.length > 0) {
            const lane = highCongestion[0];
            items.push({
                title: 'Congestion Mitigation',
                description: `${lane.id} lane at ${Math.round(lane.density * 100)}% capacity. Recommend +12s green allocation.`,
                severity: lane.density > 0.8 ? 'Critical' : 'Medium',
                impact: `-${Math.round(lane.density * 40)}% Delay`,
                laneId: `${lane.id.toUpperCase()}_QUAD`,
                confidence: 0.89,
            });
        }
        if (highCongestion.length > 1) {
            items.push({
                title: 'Multi-Lane Pressure',
                description: `${highCongestion.length} lanes exceeding 60% capacity. Wave sync recommended.`,
                severity: 'Critical',
                impact: `Flow +${Math.round(highCongestion.length * 12)}%`,
                laneId: 'GRID_SYNC',
                confidence: 0.76,
            });
        }
        if (lowCongestion.length >= 2) {
            items.push({
                title: 'Energy Preservation',
                description: `Low density on ${lowCongestion.map(l => l.id).join(', ')}. Entering short-cycle eco mode.`,
                severity: 'Low',
                impact: 'Eco +15%',
                laneId: 'ECO_MODE',
                confidence: 0.95,
            });
        }
        items.push({
            title: 'Adaptive Timing Sync',
            description: 'North-South green wave calibrated for optimal throughput at current density levels.',
            severity: 'Low',
            impact: 'Sync OK',
            laneId: 'CORE_HUB',
            confidence: 0.92,
        });
        return items.slice(0, 4);
    }, [trafficData?.lanes?.map(l => `${l.id}:${l.density}`).join(',')]);

    return (
        <div className="glass-vibrant rounded-2xl p-6 h-full flex flex-col relative overflow-hidden group/ai">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/[0.04] rounded-full blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="absolute inset-[-4px] bg-primary/10 rounded-xl blur-md animate-pulse" />
                        <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 relative z-10 group-hover/ai:scale-110 transition-transform duration-500">
                            <BrainCircuit size={20} className="text-primary" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Decision Matrix</h3>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                            <Activity size={8} className="text-primary animate-pulse" />
                            <p className="text-[8px] text-slate-400 font-mono font-bold uppercase tracking-[0.2em]">AI-Core v5.4</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-primary/[0.08] rounded-full border border-primary/15">
                    <Target size={10} className="text-primary" />
                    <span className="text-[8px] font-black text-primary uppercase">{suggestions.length} Active</span>
                </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1 relative z-10 pb-4">
                {suggestions.map((s, i) => (
                    <SuggestionCard key={`${s.laneId}-${i}`} {...s} index={i} />
                ))}
            </div>

            <div className="mt-4 relative z-10">
                <button className="w-full relative group/action overflow-hidden rounded-xl p-px active:scale-[0.97] transition-transform duration-200">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-primary to-cyan-500 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    <div className="relative px-5 py-3 rounded-[11px] bg-white group-hover/action:bg-white/80 transition-colors duration-400 flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-primary group-hover/action:text-emerald-700 transition-colors">
                            <Zap size={16} fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Execute Mesh Sync</span>
                        </div>
                        <ArrowRight size={16} className="text-primary group-hover/action:text-emerald-700 group-hover/action:translate-x-1 transition-all" />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default memo(AISuggestionsPanel);
