// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // ESSENCIAL: Garante que o Tailwind procure classes em todos os seus componentes
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}