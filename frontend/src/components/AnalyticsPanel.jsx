import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

const AnalyticsPanel = ({ stats }) => {
    const cards = [
        { label: 'Avg Wait Time', val: `${stats.avgWaitingTime}s`, icon: Clock, change: '-12%', color: 'text-primary' },
        { label: 'Congestion Reduction', val: `${stats.congestionReduction}%`, icon: TrendingUp, change: '+5%', color: 'text-accent' },
        { label: 'Total Pedestrians', val: '1,240', icon: Users, change: 'Stable', color: 'text-slate-400' },
        { label: 'AI Optimization', val: 'Enabled', icon: BarChart3, change: '100%', color: 'text-primary' }
    ];

    return (
        <div className="grid grid-cols-4 gap-4">
            {cards.map((card, i) => (
                <div key={i} className="glass rounded-2xl p-4 border border-white/5">
                    <div className="flex items-start justify-between mb-2">
                        <div className="p-2 bg-white/5 rounded-lg">
                            <card.icon size={16} className="text-slate-400" />
                        </div>
                        <span className={`text-[10px] font-bold ${card.color}`}>{card.change}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mb-1">{card.label}</div>
                    <div className="text-xl font-bold text-white font-mono tracking-tighter">{card.val}</div>
                </div>
            ))}
        </div>
    );
};

export default AnalyticsPanel;
