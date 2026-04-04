/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', ...defaultTheme.fontFamily.sans],
        display: ['Clash Display', 'Inter Variable', ...defaultTheme.fontFamily.sans],
        accent: ['Sora Variable', 'Inter Variable', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#EF4F5F',
        background: '#0B0F1A',
        card: '#111827',
        'text-secondary': '#9CA3AF',
        accent: '#FACC15',
        slate: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        teal: {
          400: '#2dd4bf',
        },
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};