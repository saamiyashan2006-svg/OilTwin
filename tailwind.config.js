/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          black: '#050608',
          900: '#0a0c10',
          800: '#0f1218',
          700: '#161a23',
          600: '#1e232e',
          500: '#2a3040',
        },
        steel: {
          400: '#6b7689',
          300: '#8a95a8',
          200: '#b0b9c9',
          100: '#d4dae6',
        },
        oil: {
          600: '#7a5c18',
          500: '#a67c1f',
          400: '#c89b2c',
          300: '#e0b848',
          200: '#f0d068',
        },
        accent: {
          600: '#1a6b6b',
          500: '#229090',
          400: '#2db8b8',
        },
        status: {
          green: '#3dd68c',
          amber: '#f0a830',
          red: '#f0505a',
        },
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 24s linear infinite',
        'scan': 'scan 3s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};
