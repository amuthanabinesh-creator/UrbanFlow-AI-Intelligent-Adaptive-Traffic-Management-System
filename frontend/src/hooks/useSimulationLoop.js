import { useEffect, useRef } from 'react';

/**
 * Fixed-frequency simulation loop, decoupled from rAF rendering.
 * Runs physics/logic at a stable tick rate (default 25Hz).
 * Uses rAF internally for timing but throttles execution.
 */
export const useSimulationLoop = (callback, frequency = 25) => {
    const callbackRef = useRef(callback);
    const lastTickRef = useRef(0);

    // Keep callback ref current synchronously
    callbackRef.current = callback;

    const interval = 1000 / frequency;

    useEffect(() => {
        let frameId;

        const tick = (time) => {
            const elapsed = time - lastTickRef.current;
            if (elapsed >= interval) {
                callbackRef.current(elapsed);
                lastTickRef.current = time;
            }
            frameId = requestAnimationFrame(tick);
        };

        frameId = requestAnimationFrame(tick);
        return () => {
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [interval]);
};
