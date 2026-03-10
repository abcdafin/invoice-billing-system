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
        brand: {
          navy: '#003366', // Original sidebar color
          darkGray: '#334155',
          lightGray: '#cbd5e1',
          orange: '#f97316', // More vibrant modern orange
          lightBlue: '#e0f2fe',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(249, 115, 22, 0.3)',
      }
    },
  },
  plugins: [],
}
