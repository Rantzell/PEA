/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#c8102e',
          dark: '#a10d25',
        },
        ink: '#0b1220',
      },
    },
  },
  plugins: [],
}
