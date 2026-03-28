
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        magenta: {
          50: '#fdf2f9',
          100: '#fce7f5',
          200: '#fccfeb',
          300: '#fa9dda',
          400: '#f65dc0',
          500: '#e932a2',
          600: '#d61d87',
          700: '#b3176f',
          800: '#94165d',
          900: '#7b164e',
          950: '#500632',
        }
      },
      height: {
        '120': '30rem',
      }
    },
  },
  plugins: [],
}
