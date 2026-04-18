/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#C0392B',
          light: '#E87A6E',
          bg: '#FDECEA',
          hover: '#A93226',
        },
        bg: {
          base: '#FFFFFF',
          surface: '#F9F9F9',
          elevated: '#F3F3F3',
          input: '#F5F5F5',
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#555555',
          hint: '#999999',
        },
        border: {
          DEFAULT: '#E5E5E5',
          strong: '#CCCCCC',
        },
        success: '#2E7D5E',
        warning: '#B45309',
        link: '#1A6FBF',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
