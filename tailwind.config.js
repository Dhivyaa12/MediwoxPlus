/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'type-full-sentence-loop': {
          '0%': { width: '0ch', opacity: '1' },
          '10%': { width: '14ch', opacity: '1' },
          '15%': { width: '14ch', opacity: '1' },
          '25%': { width: '27ch', opacity: '1' },
          '40%': { width: '27ch', opacity: '1' },
          '60%': { width: '27ch', opacity: '1' },
          '70%': { opacity: '0' },
          '100%': { width: '0ch', opacity: '0' },
        },
        'type-second-line': {
          '0%': { width: '0ch' },
          '100%': { width: '12ch' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scroll-ads': {
          '0%': { top: '100%' },
          '100%': { top: '-100%' },
        },
        'flash-reveal': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'type-full-sentence-loop': 'type-full-sentence-loop 10s steps(27) infinite forwards',
        'type-second-line': 'type-second-line 1.5s steps(12, end) forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.2s ease-in-out forwards',
        'scroll-ads': 'scroll-ads 12s linear infinite',
        'flash-in': 'flash-reveal 0.4s ease forwards',
      },
    },
  },
  plugins: [],
};

