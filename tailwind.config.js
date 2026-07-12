/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F6F7FB',
          soft: '#EEF1F8',
        },
        ink: {
          DEFAULT: '#0B1120',
          50: '#F4F6FB',
          100: '#E7EBF5',
          200: '#C7D0E5',
          300: '#9AA8C7',
          400: '#65739C',
          500: '#414D71',
          600: '#2C3654',
          700: '#1E2740',
          800: '#141B2E',
          900: '#0B1120',
          950: '#060910',
        },
        flow: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        signal: {
          50: '#EFFCFA',
          100: '#CFF7F0',
          200: '#A0EEE0',
          300: '#63DECC',
          400: '#2DC4B3',
          500: '#0EA5A0',
          600: '#0B8783',
          700: '#0D6C6A',
          800: '#105655',
          900: '#124847',
        },
        priority: {
          high: '#EF4444',
          medium: '#F59E0B',
          low: '#22C55E',
        },
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(15, 23, 42, 0.08), 0 8px 24px -8px rgba(15, 23, 42, 0.10)',
        'soft-lg': '0 8px 30px -8px rgba(15, 23, 42, 0.16), 0 24px 48px -16px rgba(15, 23, 42, 0.14)',
        glow: '0 0 0 1px rgba(99, 102, 241, 0.15), 0 8px 24px -4px rgba(99, 102, 241, 0.35)',
        'inner-glass': 'inset 0 1px 0 0 rgba(255,255,255,0.4)',
      },
      backgroundImage: {
        'flow-gradient': 'linear-gradient(135deg, #4F46E5 0%, #4338CA 45%, #0EA5A0 100%)',
        'flow-gradient-soft': 'linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(14,165,160,0.15) 100%)',
        'mesh-light': 'radial-gradient(at 20% 0%, rgba(99,102,241,0.14) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(14,165,160,0.12) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(99,102,241,0.08) 0px, transparent 50%)',
        'mesh-dark': 'radial-gradient(at 20% 0%, rgba(99,102,241,0.20) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(14,165,160,0.16) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(67,56,202,0.20) 0px, transparent 50%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(99,102,241,0.35)' },
          '100%': { boxShadow: '0 0 0 10px rgba(99,102,241,0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        shimmer: 'shimmer 2s infinite linear',
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
