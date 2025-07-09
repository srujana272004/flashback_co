/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Crimson Text', 'Libre Baskerville', 'Georgia', 'serif'],
        'sans': ['Crimson Text', 'Inter', 'system-ui', 'sans-serif'],
        'typewriter': ['Special Elite', 'Courier Prime', 'Courier New', 'monospace'],
        'handwritten': ['Amatic SC', 'cursive'],
        'retro-display': ['Playfair Display', 'Crimson Text', 'serif'],
        'retro-script': ['Amatic SC', 'Special Elite', 'cursive'],
      },
      colors: {
        cream: {
          50: '#faf8f3',
          100: '#f4f1e8',
          200: '#e8dcc0',
          300: '#d4c4a0',
          400: '#c4a980',
          500: '#b8956b',
          600: '#a8845a',
          700: '#8b7355',
          800: '#6b5940',
          900: '#4a3d2a',
        },
        vintage: {
          50: '#faf8f3',
          100: '#f4f1e8',
          200: '#e8dcc0',
          300: '#d4c4a0',
          400: '#c4a980',
          500: '#b8956b',
          600: '#a8845a',
          700: '#8b7355',
          800: '#6b5940',
          900: '#4a3d2a',
        },
      },
      animation: {
        'curtain-left': 'curtainLeft 1s ease-in-out forwards',
        'curtain-right': 'curtainRight 1s ease-in-out forwards',
        'flash': 'flash 0.2s ease-in-out',
        'dim': 'dim 0.5s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        curtainLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        curtainRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        },
        flash: {
          '0%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        dim: {
          '0%': { opacity: '0' },
          '100%': { opacity: '0.6' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(245, 158, 11, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      }
    },
  },
  plugins: [],
};