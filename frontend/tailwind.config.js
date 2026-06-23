/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                background: '#f0f4f8',
                card: 'rgba(255, 255, 255, 0.75)',
                primary: '#059669',
                secondary: '#dc2626',
                accent: '#0891b2',
                warning: '#d97706',
                signal: {
                    red: '#dc2626',
                    yellow: '#d97706',
                    green: '#059669',
                }
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'shimmer': 'shimmer 2.5s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
                'grid-flow': 'gridFlow 20s linear infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'scan': 'scan 3s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                gridFlow: {
                    '0%': { transform: 'translate3d(0, 0, 0)' },
                    '100%': { transform: 'translate3d(80px, 80px, 0)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '0.3' },
                    '50%': { opacity: '0.8' },
                },
                scan: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
                    '50%': { transform: 'translate3d(0, -8px, 0)' },
                },
            }
        },
    },
    plugins: [],
}
