import React from 'react';
import { AdminView } from '../types/gameTypes'; // Ajuste o caminho conforme necessário

// Input de Formulário Padrão
export const FormInput: React.FC<{ 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  required?: boolean; 
  type?: string 
}> = ({ label, value, onChange, required = false, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

// Select de Formulário Padrão
export const FormSelect: React.FC<{ 
  label: string; 
  value: string | number; 
  options: (string | number)[]; 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void 
}> = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
    >
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

// Botão de Navegação Admin
export const AdminNavButton: React.FC<{
      // CORRIGIDO: Deve ser AdminView (o valor que o botão representa)
      view: AdminView; 
      // CORRIGIDO: Deve ser AdminView (o estado atual)
      currentView: AdminView;
      // CORRIGIDO: A função deve aceitar AdminView, não string
      onClick: (view: AdminView) => void;
      children: React.ReactNode;
    }> = ({ view, currentView, onClick, children }) => (
      <button
        onClick={() => onClick(view)}
        className={`px-4 py-2 rounded-lg font-semibold transition ${
          currentView === view
            ? 'bg-indigo-600 text-white shadow-md'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        {children}
      </button>
    );