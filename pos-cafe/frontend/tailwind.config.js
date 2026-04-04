/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff9eb',
          100: '#fef0c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f'
        },
        accent: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0f766e'
        },
        surface: {
          950: '#020617',
          900: '#0f172a',
          850: '#111c31',
          800: '#1e293b'
        }
      },
      boxShadow: {
        panel: '0 24px 70px rgba(2, 6, 23, 0.45)',
        glow: '0 0 0 1px rgba(245, 158, 11, 0.22), 0 18px 50px rgba(245, 158, 11, 0.18)'
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 20% 20%, rgba(245,158,11,0.18), transparent 28%), radial-gradient(circle at 80% 0%, rgba(45,212,191,0.15), transparent 24%), linear-gradient(135deg, rgba(2,6,23,0.96), rgba(15,23,42,0.98))',
        'amber-glow': 'radial-gradient(circle at center, rgba(245,158,11,0.25), transparent 70%)'
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }
    }
  },
  plugins: [],
};