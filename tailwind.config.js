/** @type {import('tailwind.config').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          700: '#1e293b',
          800: '#0f172a',
          900: '#090d16',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        tealbrand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        warmbg: '#faf9f6',
      },
      borderRadius: {
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
