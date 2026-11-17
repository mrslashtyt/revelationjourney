/** @type {import('tailwind.config.js')} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#fdfcf9',
          100: '#faf8f3',
          200: '#f4f1e8',
          300: '#ece7d8',
        },
        charcoal: {
          900: '#1a1a1a',
          800: '#2a2a2a',
          700: '#3d3d3d',
          600: '#555555',
          500: '#6b6b6b',
          400: '#8a8a8a',
          300: '#a8a8a8',
          200: '#c8c8c8',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c7d8c7',
          300: '#a3c0a3',
          400: '#7fa67f',
          500: '#5c8a5c',
          600: '#456f45',
          700: '#345234',
        },
        olive: {
          50: '#f6f6ee',
          100: '#ebedd8',
          200: '#d7dab4',
          300: '#bcc585',
          400: '#9eab5c',
          500: '#82904a',
          600: '#65733a',
          700: '#4d572d',
        },
        sand: {
          50: '#fbf8f1',
          100: '#f5ede0',
          200: '#ead9c0',
          300: '#ddc195',
          400: '#cda866',
          500: '#b8903f',
          600: '#9a7630',
          700: '#7c5e25',
        },
        bronze: {
          300: '#c9a877',
          400: '#b08d56',
          500: '#94743d',
          600: '#785c2e',
          700: '#5c4723',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        heading: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arabic: ['"Scheherazade New"', '"Amiri"', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fadeIn 0.5s ease-out both',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in': 'scaleIn 0.35s cubic-bezier(0.22,1,0.36,1) both',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 30s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'dash-flow': 'dashFlow 1.4s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'blink': 'blink 1s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        dashFlow: {
          to: { strokeDashoffset: '-28' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
