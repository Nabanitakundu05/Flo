/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        'dm-mono': ['DM Mono', 'monospace'],
      },
      colors: {
        bg: {
          // bg-base used with /90 opacity in Navbar — needs rgb() format
          base: 'rgb(var(--rgb-bg-base) / <alpha-value>)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          hover: 'var(--bg-hover)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          muted: 'var(--border-muted)',
        },
        accent: {
          indigo: '#6366f1',
          'indigo-dim': '#4f46e5',
        },
        // income/expense used with opacity (/10 /20 /30) — needs rgb() format
        income: {
          DEFAULT: 'rgb(var(--rgb-income) / <alpha-value>)',
          muted: 'var(--income-muted)',
          dim: 'var(--income-dim)',
        },
        expense: {
          DEFAULT: 'rgb(var(--rgb-expense) / <alpha-value>)',
          muted: 'var(--expense-muted)',
          dim: 'var(--expense-dim)',
        },
        warm: {
          100: 'var(--warm-100)',
          200: 'var(--warm-200)',
          300: 'var(--warm-300)',
          400: 'var(--warm-400)',
          500: 'var(--warm-500)',
          600: 'var(--warm-600)',
          700: 'var(--warm-700)',
          800: 'var(--warm-800)',
          900: 'var(--warm-900)',
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite',
        'fade-up': 'fadeUp 280ms ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
