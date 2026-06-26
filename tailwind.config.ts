import type { Config } from 'tailwindcss';

/**
 * Punjabi Cuisine — design tokens.
 * Warm-neutral luxury system: deep charcoal grounds, a single metallic gold
 * accent, warm cream highlights, and a restrained Punjabi deep-red.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0A0A', // deep black background
          800: '#141414',
          700: '#1C1A17', // warm charcoal
          600: '#272320',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C96D',
          deep: '#A07830',
        },
        cream: '#F5F2EC', // near-white (the "white" of the white/gold/black kit)
        paper: '#F5F2EC', // light surface alias for inverted sections
        ember: '#8B1A1A', // deep Punjabi red, used sparingly
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        accent: ['var(--font-accent)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.35em',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        smooth: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      maxWidth: {
        editorial: '1320px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 6s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
