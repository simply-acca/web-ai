/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ⬅️ critical: class strategy for your .dark toggle
  theme: {
    extend: {
      fontFamily: {
      sans: ['var(--font-inter)', 'sans-serif'],
    } ,
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
    },
  },
};