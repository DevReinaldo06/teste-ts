// frontend/.stylelintrc.js

module.exports = {
  extends: [
    'stylelint-config-standard',
    // Pacote essencial para reconhecer a sintaxe do Tailwind
    'stylelint-config-tailwindcss',
  ],
  rules: {
    // Permite explicitamente as regras internas do Tailwind, como @apply e @tailwind
    'at-rule-no-unknown': [true, {
      ignoreAtRules: [
        'tailwind',
        'apply',
        'variants',
        'screen',
        'layer'
      ]
    }],
    'function-no-unknown': null,
  },
};