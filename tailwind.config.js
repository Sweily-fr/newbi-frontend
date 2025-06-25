/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5b50ff",
        "primary-light": "#f0eeff",
        "primary-hover": "#4a41e0",
      },
      borderRadius: {
        'xl': '0.625rem',
      },
    },
  },
  plugins: [],
}
