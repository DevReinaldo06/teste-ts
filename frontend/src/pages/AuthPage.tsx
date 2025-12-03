// src/pages/AuthPage.tsx

import React, { useState } from 'react';

// Atualização de importações
import { AppPage, User, ADMIN_EMAIL } from '../types/gameTypes'; 
import { loginUser, registerUser } from '../services/apiService'; 
import { FormInput } from '../components/FormElements';

// A URL base do backend é crucial para a comunicação
const API_BASE_URL = 'http://localhost:3000';

const AuthPage: React.FC<{
  setCurrentPage: (page: AppPage) => void;
  setAppMessage: (msg: string | null) => void;
  setCurrentUser: (user: User | null) => void;
}> = ({ setCurrentPage, setAppMessage, setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Será a CHAVE DE ACESSO no modo Admin
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAppMessage(null);

    try {
      if (isAdminMode) {
        // --- Acesso Administrativo via API Segura ---
        
        // 1. Chama a rota de backend para verificar a chave de acesso (password)
        const response = await fetch(`${API_BASE_URL}/auth/admin-key`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            if (!response.ok) {
                setAppMessage(`Erro de comunicação (Status: ${response.status}). Verifique o console e a configuração CORS.`);
                setLoading(false);
                return;
            }
            data = { adminKeyValid: false, message: "Resposta inesperada do servidor." };
        }

        // 2. Verifica a resposta da API (espera 'adminKeyValid: true')
        if (response.ok && data.adminKeyValid) {
          // Sucesso: Backend confirmou a chave.
          // O ID de administrador é um placeholder, pois a API é stateless
          setCurrentUser({ id: 'admin-temp-id', email: ADMIN_EMAIL, isAdmin: true, password: password }); 
          setCurrentPage(AppPage.AdminDashboard); 
        } else {
          setAppMessage(data.message || "Chave de Administrador inválida ou erro na API.");
        }
      } else if (isRegisterMode) {
        // Cadastro (usando a nova função registerUser do apiService)
        // 🎯 CORRIGIDO: Incluindo isAdmin: false para satisfazer Omit<User, "id">
        await registerUser({ email, password, isAdmin: false });
        setAppMessage("Cadastro realizado com sucesso! Faça login.");
        setIsRegisterMode(false);
        setEmail('');
        setPassword('');
      } else {
        // Login Comum (usando a nova função loginUser do apiService)
         // O login não precisa de isAdmin, mas se loginUser estivesse esperando Omit<User, "id">,
         // esta linha também daria erro. Assumimos que loginUser espera apenas as credenciais.
        const user = await loginUser({ email, password });
        setCurrentUser(user);
        setCurrentPage(AppPage.MainGame);
      }
    } catch (error) {
      console.error("Erro na autenticação:", error);
      setAppMessage(error instanceof Error ? error.message : "Ocorreu um erro inesperado. Verifique a consola.");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isAdminMode) return "Acesso Administrativo";
    if (isRegisterMode) return "Cadastrar Usuário";
    return "Acesso do Usuário";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <form onSubmit={handleAuthSubmit} className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">{getTitle()}</h1>
        
        {(!isAdminMode) && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 dark:text-white transition duration-150"
              placeholder="seu@email.com"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isAdminMode ? 'Chave de Acesso' : 'Senha'}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 dark:text-white transition duration-150"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Acessando...' : isRegisterMode ? 'Cadastrar' : 'Acessar'}
        </button>
        
        {!isRegisterMode && !isAdminMode && (
          <div className="mt-6 flex flex-col space-y-3">
            <button
              type="button"
              onClick={() => { setIsRegisterMode(true); setEmail(''); setPassword(''); }}
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition duration-150"
            >
              Ainda não sou cadastrado
            </button>
            <button
              type="button"
              onClick={() => { setIsAdminMode(true); setEmail(''); setPassword(''); }}
              className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition duration-150"
            >
              Acesso Administrativo
            </button>
          </div>
        )}

        {(isRegisterMode || isAdminMode) && (
          <button
            type="button"
            onClick={() => { setIsRegisterMode(false); setIsAdminMode(false); setEmail(''); setPassword(''); }}
            className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg shadow-md transition duration-200"
          >
            Voltar ao Login
          </button>
        )}
      </form>
    </div>
  );
};

export default AuthPage;