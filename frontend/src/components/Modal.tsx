import React from 'react';

// 1. Tipagem CORRIGIDA para incluir 'isConfirm'
const Modal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    children: React.ReactNode; 
    title: string; 
    isConfirm?: boolean; // <-- PROPRIEDADE ADICIONADA
}> = ({ isOpen, onClose, children, title, isConfirm }) => { // 2. Adicione 'isConfirm' aos props
  if (!isOpen) return null;

  // Você pode usar 'isConfirm' aqui para ajustar o estilo ou botões do modal,
  // mas mesmo sem usá-lo, a adição na tipagem resolve o erro.
    
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="text-gray-700 dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;