/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-in': 'bounceIn 0.6s ease-out',
        'draw-check': 'drawCheck 0.8s ease-in-out forwards',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        drawCheck: {
          '0%': { 'stroke-dashoffset': '50' },
          '100%': { 'stroke-dashoffset': '0' },
        },
      },
    },
  },
  plugins: [],
}
