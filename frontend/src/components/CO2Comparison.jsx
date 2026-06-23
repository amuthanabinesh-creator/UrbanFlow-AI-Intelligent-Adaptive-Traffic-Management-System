import React, { memo, useMemo, useRef, useEffect, useState } from 'react';
import { Leaf, TrendingDown, Wind, Zap, Activity, Globe, Fuel, Award, ArrowDown, Scale } from 'lucide-react';

/**
 * AnimatedEmissionCounter — Direct DOM textContent update via rAF for smooth counting.
 */
const AnimatedEmissionCounter = memo(({ value, suffix = 'kg' }) => {
    const elRef = useRef(null);
    const currentRef = useRef(0);
    const rafRef = useRef(null);

    useEffect(() => {
        const numVal = parseFloat(value);
        if (isNaN(numVal)) return;
        const startVal = currentRef.current;
        const startTime = performance.now();
        const duration = 1200;

        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(2, -10 * progress);
            const current = startVal + (numVal - startVal) * eased;
            currentRef.current = current;
            if (elRef.current) {
                elRef.current.textContent = `${current.toFixed(1)} ${suffix}`;
            }
            if (progress < 1) rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [value, suffix]);

    return (
        <span ref={elRef} className="font-mono tabular-nums inline-block transition-transform duration-200" style={{ willChange: 'transform' }}>
            {parseFloat(value || 0).toFixed(1)} {suffix}
        </span>
    );
});
AnimatedEmissionCounter.displayName = 'AnimatedEmissionCounter';

/**
 * Radial gauge with CSS-driven stroke animation.
 */
const RadialGauge = memo(({ value, label }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const safeValue = isNaN(value) ? 0 : Math.max(0, Math.min(100, value));
    const offset = circumference - (safeValue / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} stroke="rgba(0,0,0,0.06)" strokeWidth="5" fill="transparent" />
                <circle
                    cx="50" cy="50" r={radius}
                    stroke="url(#ecoGaugeGradLight)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />
                <defs>
                    <linearGradient id="ecoGaugeGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#059669" />
                        <stop offset="100%" stopColor="#0891b2" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800 leading-none tabular-nums tracking-tighter font-mono">
                    {Math.round(safeValue)}<span className="text-xs text-slate-400">%</span>
                </span>
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{label}</span>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-emerald-500/10 rounded-full blur-xl animate-pulse pointer-events-none" />
        </div>
    );
});
RadialGauge.displayName = 'RadialGauge';

/**
 * EmissionBar — Large horizontal comparison bar with animated width and label.
 */
const EmissionBar = memo(({ label, value, maxValue, color, gradientFrom, gradientTo, icon: Icon, sublabel }) => {
    const safeVal = isNaN(value) ? 0 : value;
    const safeMax = isNaN(maxValue) || maxValue === 0 ? 1 : maxValue;
    const pct = Math.min(100, (safeVal / safeMax) * 100);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg ${color} bg-opacity-10 border border-current/10`}>
                        <Icon size={14} />
                    </div>
                    <div>
                        <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{label}</span>
                        <span className="text-[8px] text-slate-400 font-bold uppercase ml-2">{sublabel}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-lg font-black text-slate-800 font-mono tabular-nums">
                        <AnimatedEmissionCounter value={safeVal} suffix="kg" />
                    </span>
                </div>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} relative`}
                    style={{ width: `${Math.max(5, pct)}%`, transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                    <div className="absolute inset-0 shimmer-effect" />
                </div>
            </div>
        </div>
    );
});
EmissionBar.displayName = 'EmissionBar';

/**
 * CO2Comparison — Full Static vs Adaptive emission comparison panel.
 * This is a PRIMARY FEATURE: the dual comparison is visually prominent.
 */
const CO2Comparison = ({ emissions }) => {
    const staticTotal = isNaN(emissions?.staticTotal) ? 0 : emissions.staticTotal;
    const adaptiveTotal = isNaN(emissions?.adaptiveTotal) ? 0 : emissions.adaptiveTotal;
    const savedTotal = isNaN(emissions?.savedTotal) ? 0 : Math.max(0, emissions.savedTotal);
    const reductionPercent = isNaN(emissions?.reductionPercent) ? 0 : Math.max(0, Math.min(100, emissions.reductionPercent));

    const fuelSaved = (savedTotal * 0.42).toFixed(1);
    const treesEquivalent = Math.round(savedTotal * 0.045);
    const ecoWins = adaptiveTotal < staticTotal;
    const maxEmission = Math.max(staticTotal, adaptiveTotal, 1);

    const susColor = reductionPercent > 20 ? 'text-emerald-600' : reductionPercent > 10 ? 'text-amber-600' : 'text-red-600';
    const susLabel = reductionPercent > 20 ? 'Excellent' : reductionPercent > 10 ? 'Good' : 'Improving';

    // Sparkline data
    const sparkline = useMemo(() => {
        return Array.from({ length: 14 }, (_, i) => 15 + Math.random() * 55);
    }, [Math.floor(reductionPercent / 2)]);

    return (
        <div className="glass-vibrant rounded-2xl p-6 relative overflow-hidden group/co2">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/[0.06] rounded-full blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-emerald-100 rounded-xl border border-emerald-200 transition-transform duration-700 group-hover/co2:rotate-12">
                        <Leaf size={22} className="text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Emission Intel</h3>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[8px] text-emerald-600/50 font-mono font-bold uppercase tracking-[0.2em]">CO₂ Protocol</p>
                        </div>
                    </div>
                </div>
                {ecoWins && (
                    <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center space-x-1.5 shadow-sm">
                        <Award size={12} className="text-emerald-600" />
                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-wider">Eco+</span>
                    </div>
                )}
            </div>

            {/* ============================================ */}
            {/* PRIMARY: Static vs Adaptive Emission Bars    */}
            {/* ============================================ */}
            <div className="mb-5 p-5 rounded-xl bg-white/50 border border-slate-200/60 space-y-4 relative z-10"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                        <Scale size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Emission Comparison</span>
                    </div>
                    {/* Reduction badge */}
                    <div className={`px-2.5 py-1 rounded-lg border flex items-center space-x-1.5 ${reductionPercent > 15
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                            : 'bg-amber-50 border-amber-200 text-amber-600'
                        }`}>
                        <ArrowDown size={10} />
                        <span className="text-[10px] font-black tabular-nums font-mono">{reductionPercent.toFixed(1)}% Less</span>
                    </div>
                </div>

                {/* Static Signal bar */}
                <EmissionBar
                    label="Static Signal"
                    sublabel="Baseline"
                    value={staticTotal}
                    maxValue={maxEmission}
                    color="text-red-500"
                    gradientFrom="from-red-400"
                    gradientTo="to-orange-400"
                    icon={Activity}
                />

                {/* AI Adaptive bar */}
                <EmissionBar
                    label="AI Adaptive"
                    sublabel="Optimized"
                    value={adaptiveTotal}
                    maxValue={maxEmission}
                    color="text-emerald-600"
                    gradientFrom="from-emerald-500"
                    gradientTo="to-cyan-400"
                    icon={Zap}
                />
            </div>

            {/* Central gauge + key stats */}
            <div className="flex items-center gap-5 mb-5 relative z-10">
                <RadialGauge value={reductionPercent} label="Reduced" />
                <div className="flex-1 space-y-3">
                    <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Net CO₂ Saved</div>
                        <div className="text-2xl font-black text-slate-800 tabular-nums tracking-tighter font-mono">
                            <AnimatedEmissionCounter value={savedTotal} suffix="kg" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Fuel size={12} className="text-cyan-500" />
                            <span className="text-[10px] font-bold text-slate-500">{fuelSaved}L fuel</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm">🌳</span>
                            <span className="text-[10px] font-bold text-slate-500">{treesEquivalent} trees equiv</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Rating:</span>
                        <span className={`text-[10px] font-black uppercase ${susColor}`}>{susLabel}</span>
                    </div>
                </div>
            </div>

            {/* Sparkline */}
            <div className="relative z-10 mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Efficiency Wave</span>
                    <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-mono text-emerald-600/50">Live</span>
                    </div>
                </div>
                <div className="h-10 w-full flex items-end justify-between gap-[2px]">
                    {sparkline.map((v, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-emerald-400/30 via-emerald-300/15 to-transparent rounded-t-sm border-t border-emerald-400/25"
                            style={{
                                height: `${v}%`,
                                transition: `height 0.8s ease-out ${i * 0.04}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Footer insight */}
            <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200/60 relative z-10">
                <Wind size={16} className="text-emerald-600/60 flex-shrink-0" />
                <p className="text-[9px] text-slate-500 font-bold leading-relaxed">
                    <span className="text-emerald-600 font-black">AI:</span> Adaptive routing reduces emission by{' '}
                    <span className="text-slate-800 font-black">{reductionPercent.toFixed(1)}%</span> vs static baseline.
                    Saved <span className="text-slate-800 font-black">{savedTotal.toFixed(1)}kg</span> CO₂.
                </p>
            </div>
        </div>
    );
};

export default memo(CO2Comparison);
