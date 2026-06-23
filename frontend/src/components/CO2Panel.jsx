import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Leaf, TrendingDown, ArrowDownRight } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CO2Panel = ({ emissions, detailed = false }) => {
    const chartData = {
        labels: ['Static System', 'Adaptive AI'],
        datasets: [
            {
                label: 'CO2 Emission (kg)',
                data: [emissions.staticTotal, emissions.adaptiveTotal],
                backgroundColor: ['rgba(239, 68, 68, 0.4)', 'rgba(16, 185, 129, 0.4)'],
                borderColor: ['#ef4444', '#10b981'],
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { display: false },
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } }
        }
    };

    return (
        <div className={`glass rounded-2xl p-6 ${detailed ? 'h-full' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-accent/10 rounded-lg">
                        <Wind size={18} className="text-accent" />
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">CO₂ Emission Layer</h3>
                </div>
                <div className="px-2 py-0.5 rounded bg-accent/20 text-accent text-[10px] font-bold border border-accent/30">
                    SAVING: {Math.round(emissions.reductionPercent)}%
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <div className="text-[10px] text-slate-500 uppercase mb-1">Carbon Reduction</div>
                    <div className="flex items-center space-x-1">
                        <span className="text-2xl font-bold text-primary font-mono">{Math.round(emissions.reductionPercent)}%</span>
                        <TrendingDown size={16} className="text-primary" />
                    </div>
                </div>
                <div>
                    <div className="text-[10px] text-slate-500 uppercase mb-1">Total CO₂ Saved</div>
                    <div className="text-2xl font-bold text-white font-mono">{emissions.savedTotal.toFixed(2)}<span className="text-[10px] text-slate-500 ml-1">kg</span></div>
                </div>
            </div>

            <div className="h-32 mb-4">
                <Bar data={chartData} options={options} />
            </div>

            <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Leaf size={14} className="text-primary" />
                        <span className="text-[10px] text-slate-400 capitalize">Environmental Impact</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary uppercase">Optimized</span>
                </div>

                {detailed && (
                    <div className="pt-4 border-t border-white/5 mt-4">
                        <div className="grid grid-cols-3 gap-2 py-4">
                            {[
                                { label: 'Idle Avg', val: '-34%', color: 'text-primary' },
                                { label: 'Fuel Saved', val: '12L', color: 'text-accent' },
                                { label: 'AQI Index', val: 'Good', color: 'text-primary' }
                            ].map((stat, i) => (
                                <div key={i} className="text-center p-2 bg-white/5 rounded-lg">
                                    <div className="text-[8px] text-slate-500 uppercase mb-1">{stat.label}</div>
                                    <div className={`text-xs font-bold ${stat.color}`}>{stat.val}</div>
                                </div>
                            ))}
                        </div>
                        <div className="text-[10px] text-slate-500 italic p-2 bg-yellow-500/5 rounded border border-yellow-500/10">
                            *Calculation based on average vehicle displacement and wait-time algorithms.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CO2Panel;
