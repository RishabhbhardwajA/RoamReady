import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.06), inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
        'glass-lg': '0 16px 48px -8px rgba(15, 23, 42, 0.1), inset 0 1px 2px 0 rgba(255, 255, 255, 0.9)',
        'glass-glow': '0 0 35px -5px rgba(14, 135, 235, 0.25)',
        'glass-hover': '0 20px 40px -10px rgba(14, 135, 235, 0.18), inset 0 1px 2px 0 rgba(255, 255, 255, 1)',
      },
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#38a5f8',
          500: '#0e87eb',
          600: '#026bc9',
          700: '#0355a3',
          800: '#074886',
          900: '#0c3d6f',
          950: '#08274a',
        },
        obsidian: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#090d16',
        },
        amber: {
          accent: '#f59e0b',
          warm: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.45) 100%)',
        'glass-dark-gradient': 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
        'glass-blue-gradient': 'linear-gradient(135deg, rgba(224, 239, 254, 0.6) 0%, rgba(240, 247, 255, 0.3) 100%)',
      }
    },
  },
  plugins: [],
};
export default config;

