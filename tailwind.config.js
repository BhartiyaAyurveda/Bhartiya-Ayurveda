/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '380px',
      },
      colors: {
        forest: {
          950: '#071F13',
          900: '#0B2618',
          800: '#0E3320',
          700: '#15482D',
          600: '#1E603D',
          500: '#2A7A50',
          100: '#E6EFE9',
          50: '#F2F7F4'
        },
        sand: {
          50: '#FAF8F5',
          100: '#F5F0E8',
          200: '#EBE2D4',
          300: '#DDD1BE',
          400: '#C8B79E',
        },
        gold: {
          300: '#F3D68B',
          400: '#E4BF64',
          500: '#C59B3F',
          600: '#AC822D',
          700: '#8C671D'
        },
        terracotta: {
          400: '#CF7B5C',
          500: '#B96647',
          600: '#9E5135',
        },
        sage: {
          50: '#F3F6F3',
          100: '#E3EBE4',
          200: '#C5D6C7',
          500: '#5C8261',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Plus Jakarta Sans', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
        script: ['Plus Jakarta Sans', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
        calligraphy: ['Dancing Script', 'Alex Brush', 'Caveat', 'cursive'],
      },
      boxShadow: {
        'vedic': '0 8px 30px -4px rgba(11, 38, 24, 0.08)',
        'vedic-card': '0 4px 20px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
};
