// frontend/.stylelintrc.js

module.exports = {
  // Configurações padrão e o plugin para Tailwind
  extends: [
    'stylelint-config-standard',
    'stylelint-config-tailwindcss', // ESSENCIAL para reconhecer @apply
  ],
  rules: {
    // Permite explicitamente o uso de @apply, @tailwind, etc., sem avisos
    'at-rule-no-unknown': [true, {
      ignoreAtRules: [
        'tailwind',
        'apply',
        'variants',
        'screen',
        'layer'
      ]
    }],
    // Desativa a verificação de funções que o Tailwind pode adicionar
    'function-no-unknown': null,
  },
};