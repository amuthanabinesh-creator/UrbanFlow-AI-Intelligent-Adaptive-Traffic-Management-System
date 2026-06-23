import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { Activity, Clock, Navigation, TrendingUp, Zap, ShieldCheck, Cpu, Gauge } from 'lucide-react';

const AnimatedNumber = memo(({ value, suffix = '', prefix = '', decimals = 1 }) => {
    const elRef = useRef(null);
    const currentRef = useRef(0);
    const rafRef = useRef(null);

    useEffect(() => {
        const numVal = parseFloat(value);
        if (isNaN(numVal)) return;
        const startVal = currentRef.current;
        const startTime = performance.now();
        const duration = 900;

        if (elRef.current && Math.abs(numVal - startVal) > 0.01) {
            elRef.current.style.transform = 'scale3d(1.08, 1.08, 1)';
            setTimeout(() => { if (elRef.current) elRef.current.style.transform = 'scale3d(1, 1, 1)'; }, 200);
        }

        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(2, -10 * progress);
            const current = startVal + (numVal - startVal) * eased;
            currentRef.current = current;
            if (elRef.current) {
                const formatted = decimals === 0 ? Math.round(current).toString() : current.toFixed(decimals);
                elRef.current.textContent = `${prefix}${formatted}${suffix}`;
            }
            if (progress < 1) rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [value, suffix, prefix, decimals]);

    const initial = `${prefix}${parseFloat(value || 0).toFixed(decimals)}${suffix}`;
    return (
        <span ref={elRef} className="font-mono tabular-nums inline-block transition-transform duration-200 ease-out" style={{ willChange: 'transform' }}>
            {initial}
        </span>
    );
});
AnimatedNumber.displayName = 'AnimatedNumber';

const KPIItem = memo(({ label, value, suffix, prefix, decimals, icon: Icon, color, bgColor, index, subLabel }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), index * 120);
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div
            className={`glass-vibrant rounded-2xl p-5 relative overflow-hidden group/kpi transition-all duration-500 hover:shadow-lg ${visible ? 'opacity-100' : 'opacity-0'
                }`}
            style={{
                transform: visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out, box-shadow 0.3s',
                willChange: 'transform, opacity',
            }}
        >
            <div className="absolute inset-0 shimmer-effect opacity-0 group-hover/kpi:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-[0.06] group-hover/kpi:opacity-[0.12] transition-opacity ${bgColor}`} />

            <div className="flex justify-between items-start mb-5 relative z-10">
                <div className={`p-3 rounded-xl ${bgColor} bg-opacity-10 border border-current/10 ${color} group-hover/kpi:scale-110 transition-transform duration-400`}>
                    <Icon size={20} />
                </div>
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-primary/[0.08] rounded-full border border-primary/15">
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-primary uppercase tracking-tight">Live</span>
                </div>
            </div>

            <div className="relative z-10">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</div>
                <div className="text-3xl font-black text-slate-800 tracking-tighter">
                    <AnimatedNumber value={value} suffix={suffix} prefix={prefix} decimals={decimals} />
                </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-1.5">
                    <TrendingUp size={10} className="text-primary" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{subLabel}</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-200/60 flex items-center justify-center bg-slate-50">
                    <Icon size={10} className="text-slate-300" />
                </div>
            </div>
        </div>
    );
});
KPIItem.displayName = 'KPIItem';

const KPICards = ({ stats }) => {
    if (!stats) return null;
    const kpis = [
        { label: 'AI Latency', value: 4.8, suffix: 'ms', decimals: 1, icon: Cpu, color: 'text-cyan-600', bgColor: 'bg-cyan-500', subLabel: 'Ultra-Fast' },
        { label: 'Traffic Flow', value: stats.avgWaitingTime || 68, suffix: 'v/m', decimals: 0, icon: Activity, color: 'text-amber-600', bgColor: 'bg-amber-500', subLabel: 'Throughput' },
        { label: 'CO₂ Reduction', value: stats.congestionReduction || 12.4, suffix: '%', decimals: 1, icon: ShieldCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-500', subLabel: 'Eco Gain' },
        { label: 'System Health', value: 99.98, suffix: '%', decimals: 2, icon: Zap, color: 'text-purple-600', bgColor: 'bg-purple-500', subLabel: 'Reliability' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => (
                <KPIItem key={kpi.label} {...kpi} index={i} />
            ))}
        </div>
    );
};

export default memo(KPICards);
