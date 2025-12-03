// src/App.tsx

import React, { useState, useEffect, useCallback } from 'react';
// import { useFirebase } from './hooks/useFirebase'; // REMOVIDO
// import { useCollections } from './hooks/useCollection'; // REMOVIDO
import { fetchAllCards, fetchAllUsers } from './services/apiService'; // NOVO

// Importação das Páginas
import AuthPage from './pages/AuthPage';
import MainGamePage from './pages/MainGamePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Importação dos Tipos
import { AppPage, User, Card } from './types/gameTypes';


/**
 * Componente principal da aplicação.
 * Gerencia o roteamento, o estado global de autenticação e os dados.
 */
export default function App() {
    // Estado de navegação e mensagem de feedback
    const [currentPage, setCurrentPage] = useState<AppPage>(AppPage.Login);
    const [appMessage, setAppMessage] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Estados para dados (substituindo useCollections)
    const [cards, setCards] = useState<Card[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [dataError, setDataError] = useState<string | null>(null);


    // 1. Função de carregamento de dados (substituindo useCollections)
    const loadAllData = useCallback(async () => {
        setIsLoadingData(true);
        setDataError(null);
        try {
            const [fetchedCards, fetchedUsers] = await Promise.all([
                fetchAllCards(),
                fetchAllUsers()
            ]);
            setCards(fetchedCards);
            setUsers(fetchedUsers);
            setIsLoadingData(false);
        } catch (e) {
            console.error("Erro ao carregar dados iniciais:", e);
            setDataError(`Falha ao carregar dados: ${e instanceof Error ? e.message : String(e)}`);
            setIsLoadingData(false);
        }
    }, []);

    useEffect(() => {
        // Carrega os dados na inicialização
        loadAllData();

        // Opcional: Atualizar dados a cada 30 segundos
        const intervalId = setInterval(loadAllData, 30000); 
        return () => clearInterval(intervalId);
    }, [loadAllData]);


    // 2. Função de Limpeza de Mensagem
    const clearAppMessage = useCallback(() => {
        setAppMessage(null);
    }, []);

    // Exibe o carregamento inicial (splash screen)
    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <svg className="animate-spin h-10 w-10 text-indigo-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg">Conectando ao Backend...</p>
                </div>
            </div>
        );
    }
    
    // Exibe Erros de Inicialização Críticos
    if (dataError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-800 text-white p-8">
                <h1 className="text-2xl font-bold">Erro Crítico de Conexão com a API</h1>
                <p className="mt-4">{dataError}</p>
                <p className="mt-2">Verifique se o seu servidor Node.js/Express está em execução na porta 3000.</p>
            </div>
        );
    }


    // 3. Renderização Condicional (Roteamento)
    let PageComponent: React.ReactNode;

    switch (currentPage) {
        case AppPage.MainGame:
            if (!currentUser) {
                setCurrentPage(AppPage.Login);
                return null;
            }
            PageComponent = (
                <MainGamePage 
                    // db, auth, etc., foram removidos, mas mantemos o cards e usuários
                    currentUser={currentUser}
                    cards={cards} 
                    setCurrentPage={setCurrentPage}
                    setCurrentUser={setCurrentUser}
                    setAppMessage={setAppMessage}
                    // userCollectionPath foi removido, a API lida com isso.
                />
            );
            break;

        case AppPage.AdminDashboard:
            if (!currentUser || !currentUser.isAdmin) {
                setAppMessage("Acesso negado. Credenciais de administrador necessárias.");
                setCurrentPage(AppPage.Login);
                return null;
            }
            PageComponent = (
                <AdminDashboardPage 
                    // db e paths foram removidos
                    cards={cards} 
                    users={users} 
                    setCurrentPage={setCurrentPage}
                    setAppMessage={setAppMessage}
                    // Adicionamos a função de recarregar dados para o Admin
                    refreshData={loadAllData}
                />
            );
            break;

        case AppPage.Login:
        default:
            PageComponent = (
                <AuthPage
                    // db e auth foram removidos
                    setCurrentPage={setCurrentPage}
                    setAppMessage={setAppMessage}
                    setCurrentUser={setCurrentUser} 
                    // userCollectionPath foi removido
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