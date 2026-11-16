/** @type {import('tailwind.config.js')} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#04120d',
          900: '#07211a',
          850: '#0a2c23',
          800: '#0e3a2e',
          700: '#14503f',
        },
        gold: {
          200: '#f9ecc7',
          300: '#f3dd9a',
          400: '#e9c56a',
          500: '#d9a83f',
          600: '#b9852a',
          700: '#8f651d',
        },
        cream: '#f5efe0',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['Inter', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out both',
        twinkle: 'twinkle 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 24s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'dash-flow': 'dashFlow 1.4s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px 2px rgba(233,197,106,0.25)' },
          '50%': { boxShadow: '0 0 28px 8px rgba(233,197,106,0.55)' },
        },
        dashFlow: {
          to: { strokeDashoffset: '-28' },
        },
      },
    },
  },
  plugins: [],
};
