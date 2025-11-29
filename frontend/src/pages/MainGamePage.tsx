import React, { useState, useEffect, useCallback } from 'react';
import { Firestore } from 'firebase/firestore';

import { 
      AppPage, 
      Card, 
      User, 
      Guess, 
      GuessResult, 
      TipoType, 
      NivelType, 
      ElementoType, // ✅ CORRIGIDO
      TIPO_OPTIONS, 
      NIVEL_OPTIONS, 
      ELEMENTO_OPTIONS,
      PLACEHOLDER_IMG_URL
    } from '../types/gameTypes';
import { updateUserProfile } from '../services/dbService';
import Modal from '../components/Modal';
import GuessDropdown from '../components/GuessDropdown';
import { FormInput } from '../components/FormElements';

const MainGamePage: React.FC<{
  db: Firestore | null;
  currentUser: User | null;
  cards: Card[];
  setCurrentPage: (page: AppPage) => void;
  setCurrentUser: (user: User | null) => void;
  setAppMessage: (msg: string | null) => void;
  userCollectionPath: string;
}> = ({ db, currentUser, cards, setCurrentPage, setCurrentUser, setAppMessage, userCollectionPath }) => {
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [guess, setGuess] = useState<Guess>({ tipo: null, nivel: null, elemento: null });
  const [guessResult, setGuessResult] = useState<GuessResult | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showUserDataModal, setShowUserDataModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [newEmail, setNewEmail] = useState(currentUser?.email || '');
  const [newPassword, setNewPassword] = useState(currentUser?.password || '');
  const [gameMessage, setGameMessage] = useState<string | null>(null);

  // Lógica para buscar uma carta aleatória
  const fetchRandomCard = useCallback(() => {
    setGameMessage(null);
    setGuessResult(null);
    setGuess({ tipo: null, nivel: null, elemento: null });

    if (cards.length === 0) {
      setCurrentCard(null);
      setAppMessage("Nenhuma carta disponível no banco de dados.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * cards.length);
    setCurrentCard(cards[randomIndex]);
  }, [cards, setAppMessage]);

  useEffect(() => {
    if (cards.length > 0 && !currentCard) {
      fetchRandomCard();
    }
  }, [cards, currentCard, fetchRandomCard]);


  // Lógica de Submissão de Palpite
  const handleSubmitGuess = () => {
    if (!currentCard) return setGameMessage("Carregando carta...");
    if (guess.tipo === null || guess.nivel === null || guess.elemento === null) {
      return setGameMessage("Por favor, selecione um Tipo, Nível e Elemento.");
    }

    const result: GuessResult = {
      tipoCorrect: guess.tipo === currentCard.tipo,
      nivelCorrect: guess.nivel === currentCard.nivel,
      elementoCorrect: guess.elemento === currentCard.elemento,
      isFullyCorrect: false,
    };

    result.isFullyCorrect = result.tipoCorrect && result.nivelCorrect && result.elementoCorrect;
    setGuessResult(result);

    if (result.isFullyCorrect) {
      setGameMessage("Parabéns! Você acertou todas as características!");
    } else {
      setGameMessage("Palpite submetido. Verifique os contornos verdes.");
    }
  };

  // Lógica de Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage(AppPage.Login);
    setAppMessage("Logout realizado com sucesso.");
    setShowMenu(false);
  };

  // Lógica de Atualização de Dados do Usuário
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !currentUser || !newEmail || !newPassword) return;

    try {
      const updatedUser: User = { ...currentUser, email: newEmail, password: newPassword };
      await updateUserProfile(db, userCollectionPath, updatedUser);
      
      setCurrentUser(updatedUser);

      setAppMessage("Dados do usuário atualizados com sucesso!");
      setShowUpdateUserModal(false);
      setShowUserDataModal(false);
      setShowMenu(false);

    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      setAppMessage("Erro ao atualizar dados do usuário.");
    }
  };

  // URL da imagem a ser exibida
  const imageUrl = (currentCard && guessResult?.isFullyCorrect)
    ? currentCard.imagemRevelada
    : currentCard?.imagem || PLACEHOLDER_IMG_URL;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 w-full max-w-4xl mx-auto p-4">
      
      {/* Botão de Menu Superior Direito */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>

        {/* Menu Vertical */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => { 
                setNewEmail(currentUser?.email || '');
                setNewPassword(currentUser?.password || '');
                setShowUserDataModal(true); 
                setShowMenu(false); 
              }}
              className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition rounded-t-lg"
            >
              Dados do Usuário
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition rounded-b-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-8 mt-8">
        Adivinhe o Card!
      </h1>

      {/* Área da Imagem Central */}
      <div className="flex justify-center mb-8">
        <img
          src={imageUrl}
          alt="Card do Jogo"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMG_URL;
          }}
          className="rounded-xl shadow-2xl object-cover max-w-full h-auto border-4 border-indigo-500 transition-all duration-500"
          style={{ width: '400px', height: '400px' }}
        />
      </div>

      {/* Mensagem do Jogo */}
      {gameMessage && (
        <p className={`text-center font-bold text-lg mb-6 p-3 rounded-lg ${guessResult?.isFullyCorrect ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} dark:bg-opacity-20`}>
          {gameMessage}
        </p>
      )}

      {/* Botões de Ação */}
      <div className="flex flex-col items-center space-y-4 mb-8">
        <button
          onClick={handleSubmitGuess}
          disabled={guessResult?.isFullyCorrect || !currentCard || guess.tipo === null || guess.nivel === null || guess.elemento === null}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50 w-full max-w-xs"
        >
          Submeter Palpite
        </button>

        <button
          onClick={fetchRandomCard}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50 w-full max-w-xs"
        >
          Trocar Carta / Desistir
        </button>
      </div>

      {/* Botões de Escolha de Características */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner">
        <GuessDropdown
          label="Tipo"
          options={TIPO_OPTIONS}
          selectedValue={guess.tipo}
          onSelect={(val) => setGuess({ ...guess, tipo: val as TipoType })}
          isCorrect={guessResult?.tipoCorrect ?? null}
        />
        <GuessDropdown
          label="Nível"
          options={NIVEL_OPTIONS}
          selectedValue={guess.nivel}
          onSelect={(val) => setGuess({ ...guess, nivel: val as NivelType })}
          isCorrect={guessResult?.nivelCorrect ?? null}
        />
        <GuessDropdown
          label="Elemento"
          options={ELEMENTO_OPTIONS}
          selectedValue={guess.elemento}
          onSelect={(val) => setGuess({ ...guess, elemento: val as ElementoType })}
          isCorrect={guessResult?.elementoCorrect ?? null}
        />
      </div>

      {/* --- Modal de Dados do Usuário --- */}
      <Modal
        isOpen={showUserDataModal}
        onClose={() => setShowUserDataModal(false)}
        title="Dados do Usuário"
      >
        <p><strong>Email:</strong> {currentUser?.email}</p>
        <p><strong>Senha (Simulada):</strong> {currentUser?.password}</p>
        <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
          A senha é exibida para simular a leitura do banco, mas em um sistema real, ela seria sempre oculta.
        </p>
        <button
          onClick={() => {
            setShowUpdateUserModal(true);
          }}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Alterar Dados
        </button>
      </Modal>

      {/* --- Modal de Alteração de Dados --- */}
      <Modal
        isOpen={showUpdateUserModal}
        onClose={() => setShowUpdateUserModal(false)}
        title="Alterar Dados de Cadastro"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <FormInput label="Novo Email" value={newEmail} onChange={setNewEmail} required type="email" />
          <FormInput label="Nova Senha" value={newPassword} onChange={setNewPassword} required type="password" />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Salvar Alterações
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default MainGamePage;