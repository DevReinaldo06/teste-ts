// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // ESSENCIAL: Diz ao Tailwind para procurar classes em todos os arquivos
    // .html, .js, .ts, .jsx, e .tsx dentro da pasta src/
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}