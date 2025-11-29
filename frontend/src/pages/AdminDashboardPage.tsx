import React, { useState, useCallback } from 'react';
import { Firestore } from 'firebase/firestore';

import { AppPage, Card, User, AdminView } from '../types/gameTypes';
import { addCard, updateCard, deleteCard, updateUserProfile, deleteUser } from '../services/dbService';
import { CardForm, CardList, UserList } from '../components/AdminForms';
import { AdminNavButton } from '../components/FormElements';
import Modal from '../components/Modal';


// Define a interface para o estado de confirmação
interface ConfirmState {
  isOpen: boolean;
  message: string;
  action: () => void;
  title: string;
}

const AdminDashboardPage: React.FC<{
  db: Firestore | null;
  cards: Card[];
  users: User[];
  setCurrentPage: (page: AppPage) => void;
  setAppMessage: (msg: string | null) => void;
  cardCollectionPath: string;
  userCollectionPath: string;
}> = ({ db, cards, users, setCurrentPage, setAppMessage, cardCollectionPath, userCollectionPath }) => {
  const [currentView, setCurrentView] = useState(AdminView.Cards);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    message: '',
    action: () => {},
    title: ''
  });

  const closeConfirmModal = useCallback(() => {
    setConfirmState({ isOpen: false, message: '', action: () => {}, title: '' });
  }, []);

  const handleConfirmAction = () => {
    confirmState.action();
    closeConfirmModal();
  };


  // Funções CRUD de Cards
  const handleAddCard = async (card: Omit<Card, 'id'>) => {
    if (!db) return;
    try {
      await addCard(db, cardCollectionPath, card);
      setAppMessage("Card cadastrado com sucesso!");
      setCurrentView(AdminView.Cards);
    } catch (e) {
      console.error("Erro ao adicionar card:", e);
      setAppMessage("Erro ao cadastrar card.");
    }
  };

  const handleUpdateCard = async (card: Card) => {
    if (!db) return;
    try {
      await updateCard(db, cardCollectionPath, card);
      setAppMessage(`Card '${card.name}' atualizado com sucesso!`);
    } catch (e) {
      console.error("Erro ao atualizar card:", e);
      setAppMessage("Erro ao atualizar card.");
    }
  };

  const executeDeleteCard = async (id: string, name: string) => {
    if (!db) return;
    try {
      await deleteCard(db, cardCollectionPath, id);
      setAppMessage(`Card '${name}' excluído com sucesso!`);
    } catch (e) {
      console.error("Erro ao excluir card:", e);
      setAppMessage("Erro ao excluir card.");
    }
  };

  const handleDeleteCard = (id: string, name: string) => {
    setConfirmState({
      isOpen: true,
      title: "Confirmar Exclusão de Card",
      message: `Tem certeza que deseja excluir o card: ${name}?`,
      action: () => executeDeleteCard(id, name),
    });
  };


  // Funções CRUD de Usuários
  const handleUpdateUser = async (user: User) => {
    if (!db) return;
    try {
      await updateUserProfile(db, userCollectionPath, user);
      setAppMessage(`Usuário '${user.email}' atualizado com sucesso!`);
    } catch (e) {
      console.error("Erro ao atualizar usuário:", e);
      setAppMessage("Erro ao atualizar usuário.");
    }
  };

  const executeDeleteUser = async (id: string, email: string) => {
    if (!db) return;
    try {
      await deleteUser(db, userCollectionPath, id);
      setAppMessage(`Usuário '${email}' excluído com sucesso!`);
    } catch (e) {
      console.error("Erro ao excluir usuário:", e);
      setAppMessage("Erro ao excluir usuário.");
    }
  };

  const handleDeleteUser = (id: string, email: string) => {
    setConfirmState({
      isOpen: true,
      title: "Confirmar Exclusão de Usuário",
      message: `Tem certeza que deseja excluir o usuário: ${email}?`,
      action: () => executeDeleteUser(id, email),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-4">
      {/* Barra de Navegação Admin */}
      <nav className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex justify-between mb-6">
        <div className="flex space-x-3">
          <AdminNavButton view={AdminView.NewCard} currentView={currentView} onClick={setCurrentView}>Novo Card</AdminNavButton>
          <AdminNavButton view={AdminView.Cards} currentView={currentView} onClick={setCurrentView}>Cards</AdminNavButton>
          <AdminNavButton view={AdminView.Users} currentView={currentView} onClick={setCurrentView}>Usuários</AdminNavButton>
        </div>
        <button
          onClick={() => setCurrentPage(AppPage.Login)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Sair Admin
        </button>
      </nav>

      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg min-h-[70vh]">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          {currentView === AdminView.NewCard && "Cadastrar Novo Card"}
          {currentView === AdminView.Cards && "Gerenciamento de Cards"}
          {currentView === AdminView.Users && "Gerenciamento de Usuários"}
        </h2>

        {/* Conteúdo da Visão */}
        {currentView === AdminView.NewCard && <CardForm onSubmit={handleAddCard} />}
        {currentView === AdminView.Cards && (
          <CardList
            cards={cards}
            onUpdate={handleUpdateCard}
            onDelete={handleDeleteCard}
          />
        )}
        {currentView === AdminView.Users && (
          <UserList
            users={users}
            onUpdate={handleUpdateUser}
            onDelete={handleDeleteUser}
          />
        )}
      </div>

      {/* Modal de Confirmação (Substitui window.confirm) */}
      <Modal
        isOpen={confirmState.isOpen}
        onClose={closeConfirmModal}
        title={confirmState.title}
        isConfirm={true}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">{confirmState.message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={closeConfirmModal}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmAction}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            Confirmar Exclusão
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default AdminDashboardPage;