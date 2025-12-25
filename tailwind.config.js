/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-pink': '#FF6B9B',
                'brand-pink-hover': '#F43F5E',
                'brand-bg-pink': '#FFF5F7',
                'text-dark': '#1F2937',
                'text-muted': '#6B7280',
                // New Design System
                primary: "#F43F5E", // Rose-500
                "primary-hover": "#E11D48",
                "background-light": "#F8FAFC", // Slate-50
                "background-dark": "#0F172A", // Slate-900
                "card-light": "#FFFFFF",
                "card-dark": "#1E293B", // Slate-800
                "border-light": "#E2E8F0", // Slate-200
                "border-dark": "#334155", // Slate-700
            },
            fontFamily: {
                sans: ['Outfit', 'var(--font-family)', 'sans-serif'],
                display: ["'Plus Jakarta Sans'", "sans-serif"],
            }
        },
    },
    plugins: [],
}
