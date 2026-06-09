/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#4F46E5', // Indigo-600
        success: '#16A34A', // Emerald-600
        danger: '#DC2626', // Rose-600
        slate: {
          50: '#F8FAFC', // Background
          900: '#0F172A', // Main Text
          500: '#64748B', // Secondary Text
        },
      },
    },
  },
  plugins: [],
}
