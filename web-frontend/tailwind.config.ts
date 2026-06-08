/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tj: {
          primary: '#d50d27',
          'primary-dark': '#ba0015',
          'primary-light': '#ff1744',
          secondary: '#9c0012',
          accent: '#ff6b6b',
        },
      },
      backgroundColor: {
        gradient: 'linear-gradient(135deg, #d50d27 0%, #ba0015 100%)',
      },
      backgroundImage: {
        'gradient-tj': 'linear-gradient(135deg, #d50d27 0%, #ba0015 100%)',
        'gradient-tj-reverse': 'linear-gradient(135deg, #ba0015 0%, #d50d27 100%)',
        'gradient-tj-animated': 'linear-gradient(270deg, #d50d27, #ba0015, #d50d27)',
      },
      animation: {
        // Custom animations
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'bounce-gentle': 'bounce-gentle 3s cubic-bezier(0.36, 0, 0.66, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'scale-pop': 'scale-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'rotate-spin': 'rotate-spin 1s linear infinite',
        'color-shift': 'color-shift 3s ease infinite',
        // Default tailwind overrides
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.05)',
          },
        },
        'fade-in': {
          'from': {
            opacity: '0',
            transform: 'translateY(8px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'bounce-gentle': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-8px)',
          },
        },
        'shimmer': {
          '0%': {
            'background-position': '-1000px 0',
          },
          '100%': {
            'background-position': '1000px 0',
          },
        },
        'glow-pulse': {
          '0%, 100%': {
            'box-shadow': '0 0 10px rgba(213, 13, 39, 0.3)',
          },
          '50%': {
            'box-shadow': '0 0 20px rgba(213, 13, 39, 0.6)',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-8px)',
          },
        },
        'scale-pop': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.1)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        'rotate-spin': {
          'from': {
            transform: 'rotate(0deg)',
          },
          'to': {
            transform: 'rotate(360deg)',
          },
        },
        'color-shift': {
          '0%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
          '100%': {
            'background-position': '0% 50%',
          },
        },
      },
      spacing: {
        'safe-bottom': 'max(1.5rem, env(safe-area-inset-bottom))',
        'safe-top': 'max(1.5rem, env(safe-area-inset-top))',
        'safe-left': 'max(1.5rem, env(safe-area-inset-left))',
        'safe-right': 'max(1.5rem, env(safe-area-inset-right))',
      },
      fontSize: {
        'clamp-sm': 'clamp(0.75rem, 2vw, 0.875rem)',
        'clamp-base': 'clamp(0.875rem, 2.5vw, 1rem)',
        'clamp-lg': 'clamp(1rem, 3vw, 1.25rem)',
        'clamp-xl': 'clamp(1.25rem, 4vw, 1.5rem)',
        'clamp-2xl': 'clamp(1.5rem, 5vw, 1.875rem)',
      },
      transitionTimingFunction: {
        'bounce-smooth': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      boxShadow: {
        'tj': '0 4px 15px rgba(213, 13, 39, 0.15)',
        'tj-lg': '0 8px 30px rgba(213, 13, 39, 0.25)',
        'tj-xl': '0 16px 40px rgba(213, 13, 39, 0.35)',
        'glow': '0 0 20px rgba(213, 13, 39, 0.4)',
      },
      filter: {
        'saturate-150': 'saturate(1.5)',
      },
    },
  },
  plugins: [
    // Custom plugin for utility classes
    function ({ addUtilities }: any) {
      const newUtilities = {
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.transition-smooth': {
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.6, 1)',
        },
        '.transition-bounce': {
          'transition': 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        },
        '.transition-spring': {
          'transition': 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};