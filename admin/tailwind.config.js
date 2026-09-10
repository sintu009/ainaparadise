/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fdf8f0',
          100: '#faefd9',
          200: '#f4d9a8',
          300: '#ecc06e',
          400: '#e4a43e',
          500: '#d4882a',
          600: '#b86e1f',
          700: '#8f521a',
          800: '#6b3c17',
          900: '#4a2910',
        },
      },
    },
  },
  plugins: [],
};
