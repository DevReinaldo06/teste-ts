import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Obtém o elemento raiz do DOM onde o aplicativo será montado
const container = document.getElementById('root');

if (container) {
  // Cria a raiz do React e renderiza o componente principal
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Reporta um erro se o elemento raiz não for encontrado
  console.error("Falha ao encontrar o elemento 'root'. Certifique-se de que o seu HTML o contém.");
}