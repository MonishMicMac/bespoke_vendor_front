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
            },
            fontFamily: {
                sans: ['Outfit', 'var(--font-family)', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
