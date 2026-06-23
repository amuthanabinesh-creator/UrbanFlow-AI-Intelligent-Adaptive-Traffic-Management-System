import React, { memo, useMemo } from 'react';

const SignalHead = memo(({ laneId, isActive, isEmergency, countdown }) => {
    const isGreen = (isActive || isEmergency) && countdown > 3;
    const isYellow = isActive && countdown <= 3 && countdown > 0;
    const isRed = !isActive && !isEmergency;

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col items-center mb-3 pointer-events-none select-none">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.35em] mb-1.5 font-mono">
                    {laneId}
                </span>
                <div
                    className={`
                        px-4 py-1.5 rounded-xl border-2 backdrop-blur-md
                        transition-all duration-500 font-mono
                        ${isGreen
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-[0_0_15px_rgba(5,150,105,0.2)]'
                            : isYellow
                                ? 'bg-amber-50 border-amber-400 text-amber-700 shadow-[0_0_15px_rgba(217,119,6,0.2)]'
                                : 'bg-red-50 border-red-400 text-red-700 shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                        }
                    `}
                >
                    <span className="text-xl font-black tabular-nums leading-none">
                        {isActive || isEmergency ? countdown : '--'}
                    </span>
                </div>
            </div>

            <div className="relative">
                <div className="absolute top-6 -left-12 w-12 h-1.5 bg-gradient-to-r from-slate-600 to-slate-500 rounded" />
                <div className="absolute top-6 -left-12 w-2 h-40 bg-gradient-to-b from-slate-500 via-slate-600 to-slate-700 rounded-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent w-px left-[3px]" />
                </div>

                <div className="relative w-12 h-[7.5rem] bg-slate-800 border-2 border-slate-600 rounded-2xl p-2 flex flex-col justify-between overflow-hidden"
                    style={{ boxShadow: '0 6px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

                    <div className="relative w-full aspect-square rounded-full bg-red-950/30 border border-red-900/20 flex items-center justify-center">
                        <div className={`w-[85%] h-[85%] rounded-full transition-all duration-500 ${isRed ? 'bg-red-500 signal-glow-red' : 'bg-red-950/20'}`} />
                    </div>

                    <div className="relative w-full aspect-square rounded-full bg-amber-950/30 border border-amber-900/20 flex items-center justify-center">
                        <div className={`w-[85%] h-[85%] rounded-full transition-all duration-500 ${isYellow ? 'bg-amber-500 signal-glow-yellow' : 'bg-amber-950/20'}`} />
                    </div>

                    <div className="relative w-full aspect-square rounded-full bg-emerald-950/30 border border-emerald-900/20 flex items-center justify-center">
                        <div className={`w-[85%] h-[85%] rounded-full transition-all duration-500 ${isGreen ? 'bg-emerald-500 signal-glow-green' : 'bg-emerald-950/20'}`} />
                    </div>
                </div>

                <div
                    className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-12 rounded-full pointer-events-none transition-all duration-700 ${isGreen ? 'bg-emerald-500/15 blur-[30px]'
                            : isYellow ? 'bg-amber-500/15 blur-[30px]'
                                : 'bg-red-500/15 blur-[30px]'
                        }`}
                    style={{ opacity: 0.5 }}
                />
            </div>
        </div>
    );
});

SignalHead.displayName = 'SignalHead';

const Signals = memo(({ trafficData }) => {
    if (!trafficData) return null;

    const { lanes, activeLaneIndex, countdown, isEmergencyActive, emergencyVehicle } = trafficData;

    const signalConfigs = useMemo(() => ({
        North: { containerClass: 'absolute top-4 left-[57%] -translate-x-1/2 z-50', innerClass: '' },
        South: { containerClass: 'absolute bottom-4 left-[43%] -translate-x-1/2 z-50', innerClass: 'rotate-180' },
        East: { containerClass: 'absolute right-4 top-[57%] -translate-y-1/2 z-50', innerClass: '-rotate-90' },
        West: { containerClass: 'absolute left-4 top-[43%] -translate-y-1/2 z-50', innerClass: 'rotate-90' },
    }), []);

    const labelRotations = useMemo(() => ({
        North: '', South: 'rotate-180', East: 'rotate-90', West: '-rotate-90',
    }), []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
            {lanes.map((lane, idx) => {
                const config = signalConfigs[lane.id];
                if (!config) return null;

                const isActive = idx === activeLaneIndex;
                const isEmergency = isEmergencyActive && emergencyVehicle?.laneId === lane.id;

                return (
                    <div key={lane.id} className={config.containerClass}>
                        <div className={config.innerClass}>
                            <div className={labelRotations[lane.id]}>
                                <SignalHead laneId={lane.id} isActive={isActive} isEmergency={isEmergency} countdown={countdown} />
                            </div>
                        </div>
                        {(isActive || isEmergency) && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-20 h-20 rounded-full border border-emerald-500/15 green-wave" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
});

Signals.displayName = 'Signals';
export default Signals;
