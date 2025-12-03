// frontend/src/App.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useFirebase } from './hooks/useFirebase';
import { useCollections } from './hooks/useCollection';

// Importação das Páginas
import AuthPage from './pages/AuthPage';
import MainGamePage from './pages/MainGamePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Importação dos Tipos
import { AppPage, User } from './types/gameTypes';


/**
 * Componente principal da aplicação.
 * Gerencia o roteamento, o estado global de autenticação e os dados em tempo real.
 */
export default function App() {
    // Estado de navegação e mensagem de feedback
    const [currentPage, setCurrentPage] = useState<AppPage>(AppPage.Login);
    const [appMessage, setAppMessage] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // 1. Inicialização e Autenticação Firebase
    const { 
        db, 
        auth, 
        isLoading: isFirebaseLoading, 
        isAuthReady, 
        error: firebaseError,
        setCurrentUser: setFirebaseCurrentUser, // Renomeado para evitar conflito de nome
        cardCollectionPath, 
        userCollectionPath 
    } = useFirebase();

    // Sincroniza o estado do usuário com o hook de autenticação (se necessário)
    useEffect(() => {
        // Isso é necessário porque o useFirebase já faz a lógica de buscar o perfil do usuário
        // no Firestore após o login.
        // Se o seu useFirebase já está atualizando o currentUser diretamente, 
        // esta lógica pode ser simplificada, mas mantemos a coerência.
        if (isAuthReady && !isFirebaseLoading && auth?.currentUser) {
            // Se o Firebase Auth tem um usuário, mas o nosso estado local não, o useFirebase lida
            // com a lógica de popular o User completo (com isAdmin)
        }
        // Se o login for administrativo (feito via AuthPage com credenciais fixas),
        // ele só navegará para AdminDashboard se o AuthPage definir o currentUser.
    }, [isAuthReady, isFirebaseLoading, auth, setFirebaseCurrentUser]);


    // 2. Carregamento de Coleções em Tempo Real (Apenas se o DB estiver pronto)
    const { cards, users } = useCollections(db, cardCollectionPath, userCollectionPath);

    // 3. Função de Limpeza de Mensagem
    const clearAppMessage = useCallback(() => {
        setAppMessage(null);
    }, []);

    // Exibe o carregamento inicial (splash screen)
    if (isFirebaseLoading || !isAuthReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <svg className="animate-spin h-10 w-10 text-indigo-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg">Carregando Firebase...</p>
                </div>
            </div>
        );
    }
    
    // Exibe Erros de Inicialização Críticos
    if (firebaseError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-800 text-white p-8">
                <h1 className="text-2xl font-bold">Erro Crítico de Inicialização do Firebase</h1>
                <p className="mt-4">{firebaseError}</p>
                <p className="mt-2">Verifique as variáveis de configuração de ambiente.</p>
            </div>
        );
    }


    // 4. Renderização Condicional (Roteamento)
    let PageComponent: React.ReactNode;

    switch (currentPage) {
        case AppPage.MainGame:
            // Garante que apenas usuários logados (normais ou admins) possam acessar o jogo principal
            if (!currentUser) {
                setCurrentPage(AppPage.Login);
                return null;
            }
            PageComponent = (
                <MainGamePage 
                    db={db}
                    currentUser={currentUser}
                    cards={cards} // Dados em tempo real
                    setCurrentPage={setCurrentPage}
                    setCurrentUser={setCurrentUser}
                    setAppMessage={setAppMessage}
                    userCollectionPath={userCollectionPath}
                />
            );
            break;

        case AppPage.AdminDashboard:
            // Garante que apenas usuários admin (baseado no estado) possam acessar o dashboard
            if (!currentUser || !currentUser.isAdmin) {
                setAppMessage("Acesso negado. Credenciais de administrador necessárias.");
                setCurrentPage(AppPage.Login);
                return null;
            }
            PageComponent = (
                <AdminDashboardPage 
                    db={db}
                    cards={cards} // Dados em tempo real
                    users={users} // Dados em tempo real
                    setCurrentPage={setCurrentPage}
                    setAppMessage={setAppMessage}
                    cardCollectionPath={cardCollectionPath}
                    userCollectionPath={userCollectionPath}
                />
            );
            break;

        case AppPage.Login:
        default:
            PageComponent = (
                <AuthPage
                    db={db}
                    auth={auth}
                    setCurrentPage={setCurrentPage}
                    setAppMessage={setAppMessage}
                    setCurrentUser={setCurrentUser} // Define o usuário (normal ou admin) após o login
                    userCollectionPath={userCollectionPath}
                />
            );
            break;
    }


    // Layout Principal com Notificação
    return (
        <div className="app-container bg-gray-100 dark:bg-gray-900 min-h-screen">
            {/* Mensagem de Notificação (Flutuante) */}
            {appMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-indigo-500 text-white rounded-lg shadow-xl fade-in" onClick={clearAppMessage}>
                    {appMessage}
                    <button onClick={clearAppMessage} className="ml-4 font-bold">X</button>
                </div>
            )}
            
            {PageComponent}
        </div>
    );
}