/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette
        'blazing-orange': '#FF5A00',
        'orange-dim':     '#FF8A42',
        'glacial-cyan':   '#00E5FF',
        'midnight-ink':   '#0F141C',
        'liquid-silver':  '#F3F5F8',

        // Card layers (dark theme)
        'card-dark':  '#0F141C',
        'card-mid':   '#13192A',
        'card-light': '#1B2538',

        // Text
        'text-light': '#E8EDF5',
        'text-muted': '#8A94A6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'hyper': '32px',
      },
      boxShadow: {
        'orange': '0 6px 24px rgba(255,90,0,0.4)',
        'cyan':   '0 6px 20px rgba(0,229,255,0.25)',
        'glass':  '0 8px 32px rgba(0,0,0,0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'tap-ring': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,90,0,0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(255,90,0,0)' },
        },
      },
    },
  },
  plugins: [],
};
