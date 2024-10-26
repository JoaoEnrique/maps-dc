/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/views/**/*.handlebars', './public/**/*.html'],
  theme: {
    extend: {
      colors: {
        // primary: '#5bb4ff',
        primary: {
          50: '#e3f8ff',   // Mais claro
          100: '#b3e1ff',  // Tom claro
          200: '#80c5ff',  // Tom médio claro
          300: '#5bb4ff',  // Tom padrão
          400: '#3d9ef6',  // Tom médio
          500: '#1a8ef0',  // Tom padrão mais escuro
          600: '#0079c1',  // Tom escuro
          700: '#006495',  // Tom bem escuro
          800: '#004a69',  // Tom muito escuro
          900: '#00324a',  // Mais escuro
        },
      }
    }
  },
  plugins: [],
}