// frontend/src/App.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Zap, RefreshCw, UserPlus } from 'lucide-react'; 

// Importa tipos
import type { User, Card, ConfirmModalData, NotificationType, CardPayload, NotificationState } from './types/gameTypes'; 

// Importa serviços (Mocks)
import { getUsers, deleteUser, getCards, createCard, deleteCard } from './services/dbService';

// Importa componentes
import { UserList } from './components/users/UserList';
import { CreateUserForm } from './components/users/CreateUserForm';
import { EditUserForm } from './components/users/EditUserForm';
import { CardList } from './components/cards/CardList';
import { Notification } from './components/common/Notification';
import { ConfirmModal } from './components/common/ConfirmModal';


// DEFINIÇÃO DO COMPONENTE PRINCIPAL
export default function App() {
    // === ESTADOS DE DADOS ===
    const [users, setUsers] = useState<User[]>([]);
    const [cards, setCards] = useState<Card[]>([]);

    // === ESTADOS DE CARREGAMENTO/ERRO/ENVIO ===
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [isCardsLoading, setIsCardsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Para formulários de POST/PUT
    const [usersError, setUsersError] = useState<string | null>(null);
    const [cardsError, setCardsError] = useState<string | null>(null);

    // === ESTADOS DE MODAIS ===
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [confirmModalData, setConfirmModalData] = useState<ConfirmModalData | null>(null);

    // === ESTADOS DE NOTIFICAÇÃO ===
    const [notification, setNotification] = useState<NotificationState | null>(null);
    
    // ------------------------------------------------------------------------------------------------
    // 10.1. Funções de Notificação
    // ------------------------------------------------------------------------------------------------
    const handleNotify = useCallback((message: string, type: NotificationType) => {
        setNotification({ message, type });
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(null);
    }, []);

    // ------------------------------------------------------------------------------------------------
    // 10.2. Funções de Carregamento (GET)
    // ------------------------------------------------------------------------------------------------

    const loadUsers = useCallback(async () => {
        setIsUsersLoading(true);
        setUsersError(null);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setUsersError(err instanceof Error ? err.message : 'Erro ao buscar usuários.');
            handleNotify('Falha ao carregar usuários.', 'error');
        } finally {
            setIsUsersLoading(false);
        }
    }, [handleNotify]);

    const loadCards = useCallback(async () => {
        setIsCardsLoading(true);
        setCardsError(null);
        try {
            const data = await getCards();
            setCards(data);
        } catch (err) {
            setCardsError(err instanceof Error ? err.message : 'Erro ao buscar cards.');
            handleNotify('Falha ao carregar cards.', 'error');
        } finally {
            setIsCardsLoading(false);
        }
    }, [handleNotify]);

    // Carrega dados na montagem do componente
    useEffect(() => {
        loadUsers();
        loadCards();
    }, [loadUsers, loadCards]);

    // ------------------------------------------------------------------------------------------------
    // 10.3. Funções de CRUD - Usuários
    // ------------------------------------------------------------------------------------------------

    // CREATE
    const handleUserCreated = useCallback((newUser: User) => {
        setUsers(prev => [...prev, newUser]);
    }, []);

    // UPDATE
    const handleUserUpdated = useCallback((updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        setUserToEdit(null); // Fecha o modal de edição
    }, []);

    const startEditUser = useCallback((user: User) => {
        setUserToEdit(user);
    }, []);
    
    // DELETE
    const startDeleteUser = useCallback((id: number) => {
        const user = users.find(u => u.id === id);
        if (user) {
            setConfirmModalData({ id, type: 'user', itemIdentifier: user.nome });
        }
    }, [users]);
    
    const finishDeleteUser = useCallback(async () => {
        if (!confirmModalData || confirmModalData.type !== 'user') return;
        
        const { id, itemIdentifier } = confirmModalData;
        setConfirmModalData(null);
        setIsSubmitting(true);
        
        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            handleNotify(`Usuário '${itemIdentifier}' excluído com sucesso.`, 'success');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao excluir usuário.';
            handleNotify(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    }, [confirmModalData, handleNotify]);
    
    // ------------------------------------------------------------------------------------------------
    // 10.4. Funções de CRUD - Cards
    // ------------------------------------------------------------------------------------------------

    // CREATE (Card de demonstração - Simples para não precisar de um formulário completo)
    const createDemoCard = useCallback(async () => {
        setIsSubmitting(true);
        try {
            const newCardPayload: CardPayload = {
                imagem: `https://placehold.co/150x200/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=DEMO`,
                tipo: 'DEMO',
                nivel: Math.floor(Math.random() * 10) + 1,
                classe: ['Guerreiro', 'Mago', 'Arqueiro', 'Clérigo'][Math.floor(Math.random() * 4)],
            };
            
            const newCard = await createCard(newCardPayload);
            setCards(prev => [...prev, newCard]);
            handleNotify(`Card DEMO (ID: ${newCard.id}) criado com sucesso.`, 'success');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao criar card.';
            handleNotify(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    }, [handleNotify]);
    
    // DELETE
    const startDeleteCard = useCallback((id: number) => {
        const card = cards.find(c => c.id === id);
        if (card) {
            setConfirmModalData({ id, type: 'card', itemIdentifier: `Card ID ${card.id} (${card.tipo})` });
        }
    }, [cards]);
    
    const finishDeleteCard = useCallback(async () => {
        if (!confirmModalData || confirmModalData.type !== 'card') return;
        
        const { id, itemIdentifier } = confirmModalData;
        setConfirmModalData(null);
        setIsSubmitting(true);
        
        try {
            await deleteCard(id);
            setCards(prev => prev.filter(c => c.id !== id));
            handleNotify(`Card '${itemIdentifier}' excluído com sucesso.`, 'success');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao excluir card.';
            handleNotify(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    }, [confirmModalData, handleNotify]);


    // ------------------------------------------------------------------------------------------------
    // 10.5. Renderização Principal
    // ------------------------------------------------------------------------------------------------

    // Ação unificada de confirmação
    const handleConfirmAction = useCallback(() => {
        if (!confirmModalData) return;
        
        if (confirmModalData.type === 'user') {
            finishDeleteUser();
        } else if (confirmModalData.type === 'card') {
            finishDeleteCard();
        }
    }, [confirmModalData, finishDeleteUser, finishDeleteCard]);

    const isAnyLoading = isUsersLoading || isCardsLoading || isSubmitting;


    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
                    <Zap size={32} className="text-indigo-600 mr-3" />
                    Frontend CRUD Demo (Mock API)
                </h1>
                <p className="text-gray-500 mt-1">Gerenciamento de Usuários e Cards utilizando React e TypeScript.</p>
            </header>
            
            {/* Container Principal com Duas Colunas (Tabelas) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* === COLUNA 1: USUÁRIOS === */}
                <section className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-indigo-700">Lista de Usuários</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={loadUsers}
                                disabled={isAnyLoading}
                                className="flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition disabled:opacity-50"
                                title="Recarregar Usuários"
                            >
                                <RefreshCw size={16} className={isUsersLoading ? "animate-spin mr-2" : "mr-2"} />
                                Recarregar
                            </button>
                            <button
                                onClick={() => setShowCreateUserModal(true)}
                                disabled={isSubmitting || isUsersLoading}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-md disabled:opacity-50"
                            >
                                <UserPlus size={16} className="mr-2" />
                                Novo Usuário
                            </button>
                        </div>
                    </div>
                    
                    <UserList 
                        users={users}
                        isLoading={isUsersLoading}
                        onUserDelete={startDeleteUser}
                        onUserEdit={startEditUser}
                        error={usersError}
                    />
                </section>

                {/* === COLUNA 2: CARDS === */}
                <section className="bg-white p-6 rounded-2xl shadow-xl border border-purple-100">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-purple-700">Lista de Cards</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={loadCards}
                                disabled={isAnyLoading}
                                className="flex items-center px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition disabled:opacity-50"
                                title="Recarregar Cards"
                            >
                                <RefreshCw size={16} className={isCardsLoading ? "animate-spin mr-2" : "mr-2"} />
                                Recarregar
                            </button>
                            <button
                                onClick={createDemoCard}
                                disabled={isSubmitting || isCardsLoading}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition shadow-md disabled:opacity-50"
                            >
                                <Zap size={16} className="mr-2" />
                                Criar Card DEMO
                            </button>
                        </div>
                    </div>
                    
                    <CardList
                        cards={cards}
                        isLoading={isCardsLoading}
                        onCardDelete={startDeleteCard}
                        error={cardsError}
                    />
                </section>
                
            </div>

            {/* === MODAIS E NOTIFICAÇÕES === */}
            
            {/* Modal de Criação de Usuário */}
            {showCreateUserModal && (
                <CreateUserForm
                    onUserCreated={handleUserCreated}
                    onClose={() => setShowCreateUserModal(false)}
                    onNotify={handleNotify}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                />
            )}

            {/* Modal de Edição de Usuário */}
            {userToEdit && (
                <EditUserForm
                    user={userToEdit}
                    onUserUpdated={handleUserUpdated}
                    onClose={() => setUserToEdit(null)}
                    onNotify={handleNotify}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                />
            )}

            {/* Modal de Confirmação de Exclusão */}
            {confirmModalData && (
                <ConfirmModal
                    data={confirmModalData}
                    onConfirm={handleConfirmAction}
                    onCancel={() => setConfirmModalData(null)}
                    isSubmitting={isSubmitting}
                />
            )}

            {/* Notificação Flutuante */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={closeNotification}
                />
            )}
        </div>
    );
}