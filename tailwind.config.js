/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dracula-inspired palette with expressive accent
        bg: {
          primary: '#0d0d0f',
          secondary: '#141418',
          tertiary: '#1a1a1f',
          elevated: '#222228',
        },
        text: {
          primary: '#f8f8f2',
          secondary: '#a0a0ab',
          muted: '#6b6b76',
        },
        accent: {
          DEFAULT: '#ff6b2c',
          hover: '#ff8552',
          muted: '#ff6b2c20',
        },
        border: {
          DEFAULT: '#2a2a32',
          hover: '#3a3a44',
        },
        status: {
          success: '#50fa7b',
          warning: '#ffb86c',
          error: '#ff5555',
          info: '#8be9fd',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
