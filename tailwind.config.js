/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Era themes
        'era-1950s': {
          primary: '#f59e0b',
          secondary: '#92400e',
          bg: '#fef3c7',
        },
        'era-1980s': {
          primary: '#3b82f6',
          secondary: '#1e3a8a',
          bg: '#dbeafe',
        },
        'era-2010s': {
          primary: '#a855f7',
          secondary: '#581c87',
          bg: '#f3e8ff',
        },
        // CDC brand colors
        cdc: {
          blue: '#005eaa',
          teal: '#00a89b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-light': 'bounce 2s infinite',
        'score-pop': 'scorePop 0.5s ease-out',
      },
      keyframes: {
        scorePop: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
