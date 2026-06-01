/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#B80F0A',
          hover: '#E84540',
        },
        accent: {
          DEFAULT: '#B80F0A',
          light: '#E84540',
          bg: '#FDECEA',
          hover: '#9E0B07',
        },
        bg: {
          base: '#F8F9F6',
          surface: '#FAFAF8',
          elevated: '#232323',
          input: '#F5F5F5',
          // 3-Layer Depth System — each step is -15 RGB from the previous layer
          layer1: '#EAEAEA',      // #EAEAEA (234) — container card
          layer2: '#DBDBDB',      // #DBDBDB (219) — row / pill default
          layer2Hover: '#CFCFCF', // #CFCFCF (207) — row / pill hover
        },
        text: {
          primary: '#0A0A0A',
          secondary: '#555555',
          hint: '#999999',
        },
        border: {
          DEFAULT: '#E5E5E5',
          strong: '#CCCCCC',
        },
        success: {
          DEFAULT: '#2E7D5E',
          bg: '#EAF4F0',
        },
        warning: '#B45309',
        gold: '#B8860B',
        link: {
          DEFAULT: '#1A6FBF',
          bg: '#F0F4FF',
        },
        error: '#B80F0A',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease-out both',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      maxWidth: {
        'content': '800px',
        'content-wide': '1000px',
      },
    },
  },
  plugins: [],
}
