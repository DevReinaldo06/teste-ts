import React, { useState } from 'react';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { AppPage, User, ADMIN_EMAIL, ADMIN_PASSWORD } from '../types/gameTypes';
import { findUserByCredentials, registerUser } from '../services/dbService';
import { FormInput } from '../components/FormElements';


const AuthPage: React.FC<{
  db: Firestore | null;
  auth: Auth | null;
  setCurrentPage: (page: AppPage) => void;
  setAppMessage: (msg: string | null) => void;
  setCurrentUser: (user: User | null) => void;
  userCollectionPath: string;
}> = ({ db, auth, setCurrentPage, setAppMessage, setCurrentUser, userCollectionPath }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAppMessage(null);

    if (!db) {
      setAppMessage("Erro de inicialização do Banco de Dados.");
      setLoading(false);
      return;
    }

    try {
      if (isAdminMode) {
        // Acesso Administrativo (Compara credenciais fixas)
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          // Nota: O ID 'admin-temp-id' é temporário, pois o acesso admin não é via Firestore
          setCurrentUser({ id: 'admin-temp-id', email: ADMIN_EMAIL, isAdmin: true });
          // CORREÇÃO: Usando o nome correto da enumeração
          setCurrentPage(AppPage.AdminDashboard); 
        } else {
          setAppMessage("Credenciais de Administrador inválidas.");
        }
      } else if (isRegisterMode) {
        // Cadastro
        const success = await registerUser(db, userCollectionPath, email, password);
        if (success) {
            setAppMessage("Cadastro realizado com sucesso! Faça login.");
            setIsRegisterMode(false);
            setEmail('');
            setPassword('');
        } else {
            setAppMessage("Este e-mail já está cadastrado.");
        }

      } else {
        // Login Comum
        const user = await findUserByCredentials(db, userCollectionPath, email, password);
        
        if (user) {
          setCurrentUser(user);
          setCurrentPage(AppPage.MainGame);
        } else {
          setAppMessage("Email ou senha incorretos ou usuário não cadastrado.");
        }
      }
    } catch (error) {
      console.error("Erro na autenticação:", error);
      setAppMessage("Ocorreu um erro. Verifique a consola.");
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

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
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