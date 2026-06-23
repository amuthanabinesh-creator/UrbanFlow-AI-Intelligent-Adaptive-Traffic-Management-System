import { useEffect, useRef } from 'react';

/**
 * High-performance RequestAnimationFrame loop.
 * - Uses a stable callback ref to prevent re-subscription.
 * - Never causes React re-renders.
 * - Cleans up on unmount.
 */
export const useRafLoop = (callback) => {
    const requestRef = useRef(null);
    const callbackRef = useRef(callback);

    // Always keep callback ref current — no re-subscription needed
    callbackRef.current = callback;

    useEffect(() => {
        const animate = (time) => {
            callbackRef.current(time);
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []); // Mount once, never re-subscribe
};
