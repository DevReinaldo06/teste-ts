/** @type {import('tailwindcss').Config} */
module.exports = {
    // O array `content` é a parte mais importante. 
    // Ele lista os arquivos onde o Tailwind deve procurar 
    // classes para gerar o CSS final (processo de "tree-shaking").
    content: [
      // 1. Inclui o arquivo principal index.html (geralmente na raiz, fora de src/)
      "./index.html",
      // 2. Inclui todos os arquivos .js, .jsx, .ts e .tsx dentro de src/ e suas subpastas
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      // A seção extend permite que você adicione suas próprias 
      // cores, fontes, tamanhos, etc., mantendo o tema padrão do Tailwind.
      extend: {
        // Exemplo:
        // colors: {
        //   'primary-brand': '#1E3A8A',
        // },
      },
    },
    // Aqui você pode adicionar plugins como @tailwindcss/forms, @tailwindcss/typography, etc.
    plugins: [],
  }