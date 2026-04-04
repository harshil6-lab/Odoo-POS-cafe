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
        slate: {
          900: '#0f172a',
          950: '#020617',
        },
        amber: {
          500: '#f59e0b',
        },
        teal: {
          400: '#2dd4bf',
        },
        // Semantic mapping
        background: '#020617', // slate-950
        card: '#0f172a', // slate-900
        accent: '#f59e0b', // amber-500
        secondaryAccent: '#2dd4bf', // teal-400
        textPrimary: '#ffffff', // white
        textMuted: '#94a3b8', // slate-400
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};