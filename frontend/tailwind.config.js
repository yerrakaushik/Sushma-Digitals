/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:   { DEFAULT: '#0B1D3A', light: '#1E3A5F', dark: '#060E1D' },
        gold:   { DEFAULT: '#C9A84C', light: '#E8CA7A', dark: '#9E7C2A', pale: '#F5EDD6' },
        cream:  { DEFAULT: '#FEFDF7', warm: '#F5F0E8' },
        brand: {
          blue:  '#0B1D3A',
          light: '#E8F0FF',
          white: '#FEFDF7',
        }
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gold-shimmer':    'linear-gradient(135deg, #C9A84C 0%, #E8CA7A 50%, #C9A84C 100%)',
        'navy-gold':       'linear-gradient(135deg, #060E1D 0%, #0B1D3A 50%, #1E3A5F 100%)',
        'hero-gradient':   'linear-gradient(to bottom, rgba(6,14,29,0.55) 0%, rgba(11,29,58,0.35) 60%, rgba(6,14,29,0.7) 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 24px rgba(201,168,76,0.25)',
        'gold-sm':   '0 0 12px rgba(201,168,76,0.18)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
