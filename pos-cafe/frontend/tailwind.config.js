/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f1e8',
          100: '#e9dcc5',
          200: '#d9be90',
          300: '#c89f5b',
          400: '#b58333',
          500: '#9d6b1d',
          600: '#7f5416',
          700: '#634111',
          800: '#4a300b',
          900: '#331f06'
        },
        ink: '#111827',
        paper: '#f9fafb',
        success: '#166534',
        danger: '#b91c1c',
        warning: '#b45309'
      },
      boxShadow: {
        panel: '0 18px 45px rgba(17, 24, 39, 0.08)'
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(157, 107, 29, 0.12), transparent 28%), linear-gradient(135deg, rgba(255,255,255,0.85), rgba(245,241,232,0.9))'
      }
    }
  },
  plugins: [],
};