/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-roboto)"],
      },
      colors: {
        lavender: {
          50: '#fafaff',
          100: '#f0f0ff',
          200: '#e6d9ff',
          300: '#d4b3ff',
          400: '#c8a2ff',
          500: '#b899ff',
          600: '#a68bff',
          700: '#9575ff',
          800: '#8360ff',
          900: '#7048ff',
        },
        'dark-purple': {
          50: '#3d3d5c',
          100: '#2e2e4a',
          200: '#292940',
          300: '#252540',
          400: '#202038',
          500: '#1e1e3a',
          600: '#1a1a2e',
          700: '#16162b',
          800: '#141426',
          900: '#0f0f20',
          950: '#0a0a15',
        },
        'pastel-blue': '#a8d8ff',
        'pastel-pink': '#ffb3d9',
        'pastel-mint': '#c3ffb3',
        'soft-red': '#ff8a8a',
      },
      backgroundImage: {
        'lavender-gradient': 'linear-gradient(135deg, #c8a2ff 0%, #d4b3ff 50%, #e6d9ff 100%)',
        'dark-lavender-gradient': 'linear-gradient(135deg, #1a1a2e 0%, #2e2e4a 50%, #3d3d5c 100%)',
        'radial-lavender': 'radial-gradient(ellipse at top, rgba(200, 162, 255, 0.15) 0%, transparent 70%)',
        'subtle-glow': 'radial-gradient(ellipse at center, rgba(200, 162, 255, 0.1) 0%, transparent 50%)',
      },
      boxShadow: {
        'lavender': '0 0 20px rgba(200, 162, 255, 0.3)',
        'lavender-soft': '0 4px 20px rgba(200, 162, 255, 0.1)',
        'lavender-inner': 'inset 0 2px 4px rgba(200, 162, 255, 0.1)',
        'glow-sm': '0 0 10px rgba(200, 162, 255, 0.2)',
        'glow-md': '0 0 15px rgba(200, 162, 255, 0.25)',
        'glow-lg': '0 0 25px rgba(200, 162, 255, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          'from': { boxShadow: '0 0 5px rgba(200, 162, 255, 0.2)' },
          'to': { boxShadow: '0 0 20px rgba(200, 162, 255, 0.4)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.line-clamp-1': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
