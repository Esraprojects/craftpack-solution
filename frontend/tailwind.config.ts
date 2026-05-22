import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ── Forest Green (brand accent — matches logo ribbon) ── */
        brand: {
          50:  '#f0faf4',
          100: '#dcf5e7',
          200: '#baebd0',
          300: '#86d9b0',
          400: '#52c48a',
          500: '#30a96a',
          600: '#228b55',
          700: '#1a6e44',
          800: '#165735',
          900: '#12472c',
          950: '#092619',
        },
        /* ── Warm Amber Gold (CTA accent) ── */
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        /* ── Warm Charcoal (text & UI) ── */
        dark: {
          50:  '#faf8f4',
          100: '#f0ede8',
          200: '#ddd7cc',
          300: '#bdb3a5',
          400: '#9e9080',
          500: '#7d6e5e',
          600: '#63564a',
          700: '#4d4238',
          800: '#352e26',
          900: '#1e1a15',
          950: '#111110',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)',  'system-ui', 'sans-serif'],
        mono:    ['monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'craft-texture':   'url("/textures/craft-paper.svg")',
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease-in-out',
        'fade-up':       'fadeUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'float':         'float 3s ease-in-out infinite',
        'pulse-slow':    'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':     'spin 8s linear infinite',
        'shimmer':       'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:       { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp:       { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft:  { '0%': { opacity: '0', transform: 'translateX(-20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        float:        { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer:      { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      boxShadow: {
        'card':       '0 2px 15px -3px rgba(0,0,0,0.06), 0 10px 20px -2px rgba(0,0,0,0.03)',
        'card-hover': '0 10px 40px -15px rgba(0,0,0,0.12)',
        'brand':      '0 4px 20px 0 rgba(34,139,85,0.25)',
        'gold':       '0 4px 20px 0 rgba(245,158,11,0.25)',
        'glow-brand': '0 0 40px rgba(34,139,85,0.15), 0 0 80px rgba(34,139,85,0.07)',
        'glow-gold':  '0 0 40px rgba(245,158,11,0.15), 0 0 80px rgba(245,158,11,0.07)',
      },
      backdropBlur: { xs: '2px' },
      screens: { '3xl': '1920px', '4xl': '2560px' },
    },
  },
  plugins: [],
};

export default config;
