/** @type {import('tailwind.config').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          950: '#062622',
          900: '#08332f',
          850: '#0c4a45',
          800: '#0f5953',
          700: '#0f766e',
          600: '#14b8a6',
          500: '#2dd4bf',
          100: '#ccfbf1',
          50: '#f0fdfa',
        },
        alabaster: {
          DEFAULT: '#faf9f7',
          50: '#ffffff',
          100: '#faf9f7',
          200: '#f4f3f0',
          300: '#ebe9e3',
        }
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(12, 74, 69, 0.04)',
        'card': '0 4px 20px -2px rgba(12, 74, 69, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 20px 30px -10px rgba(12, 74, 69, 0.12), 0 8px 10px -4px rgba(0, 0, 0, 0.04)',
        'elevated': '0 25px 50px -12px rgba(8, 51, 47, 0.15)',
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};