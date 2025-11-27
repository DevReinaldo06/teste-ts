import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Trash2, UserPlus, Zap, Loader2, X, Send, Save, Edit, RefreshCw } from 'lucide-react'; 

// ------------------------------------------------------------------------------------------------
// 1. Definições de Tipos (MANTIDOS)
// ------------------------------------------------------------------------------------------------

// Tipos base para as entidades
interface User {
  id: number;
  nome: string;
  idade: number;
  email: string;
}

interface Card {
  id: number;
  imagem: string;
  tipo: string;
  nivel: number;
  classe: string;
}

// Tipos para Payloads de Criação/Atualização (sem o 'id')
type UserPayload = Omit<User, 'id'>;
type CardPayload = Omit<Card, 'id'>;

// Tipo de Erro da API (não usado diretamente, mas bom para tipagem)
interface ApiErrorResponse {
  message: string;
}

// Variável global (simulada) para o URL base da API 
const API_BASE_URL = 'http://localhost:3000'; 

// ------------------------------------------------------------------------------------------------
// 2. Mock de Serviços de API (MANTIDOS)
// ------------------------------------------------------------------------------------------------

// Mock Database (simulando o estado do backend)
let mockUsers: User[] = [
  { id: 101, nome: "Alice Silva", idade: 28, email: "alice.s@example.com" },
  { id: 102, nome: "Bruno Costa", idade: 35, email: "bruno.c@example.com" },
];

let mockCards: Card[] = [
  { id: 201, imagem: "https://placehold.co/150x200/4c3d7f/ffffff?text=FOGO", tipo: "Ataque", nivel: 5, classe: "Guerreiro" },
  { id: 202, imagem: "https://placehold.co/150x200/1e88e5/ffffff?text=AGUA", tipo: "Defesa", nivel: 7, classe: "Mago" },
];

let nextUserId = 103;
let nextCardId = 203;

// Função utilitária para simular latência de rede
const simulateApiCall = (data: any = null, error: string | null = null): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(data);
      }
    }, 500); // 500ms de latência
  });
};

// CRUD - Usuários

const getUsers = async (): Promise<User[]> => {
  return simulateApiCall([...mockUsers]);
};

const deleteUser = async (id: number): Promise<void> => {
  const initialLength = mockUsers.length;
  mockUsers = mockUsers.filter(user => user.id !== id);
  if (mockUsers.length === initialLength) {
    return simulateApiCall(null, `Usuário ID ${id} não encontrado para exclusão.`);
  }
  return simulateApiCall(undefined);
};

const createUser = async (payload: UserPayload): Promise<User> => {
  // Simulação de validação
  if (!payload.nome || !payload.email || payload.idade <= 0) {
    return simulateApiCall(null, "Dados de usuário inválidos.");
  }
  const newUser: User = { id: nextUserId++, ...payload };
  mockUsers.push(newUser);
  return simulateApiCall(newUser);
};

const updateUser = async (id: number, payload: Partial<UserPayload>): Promise<User> => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex === -1) {
    return simulateApiCall(null, `Usuário ID ${id} não encontrado para atualização.`);
  }
  
  const updatedUser: User = { 
    ...mockUsers[userIndex], 
    ...payload,
    // Garante que a idade seja numérica
    idade: payload.idade !== undefined ? payload.idade : mockUsers[userIndex].idade 
  };
  
  mockUsers[userIndex] = updatedUser;
  return simulateApiCall(updatedUser);
};

// CRUD - Cards

const getCards = async (): Promise<Card[]> => {
  return simulateApiCall([...mockCards]);
};

const deleteCard = async (id: number): Promise<void> => {
  const initialLength = mockCards.length;
  mockCards = mockCards.filter(card => card.id !== id);
  if (mockCards.length === initialLength) {
    return simulateApiCall(null, `Card ID ${id} não encontrado para exclusão.`);
  }
  return simulateApiCall(undefined);
};

const createCard = async (payload: CardPayload): Promise<Card> => {
  if (!payload.tipo || !payload.imagem || payload.nivel <= 0) {
    return simulateApiCall(null, "Dados de card inválidos.");
  }
  const newCard: Card = { id: nextCardId++, ...payload };
  mockCards.push(newCard);
  return simulateApiCall(newCard);
};


// ------------------------------------------------------------------------------------------------
// 3. Componente de Mensagem/Notificação (MANTIDO)
// ------------------------------------------------------------------------------------------------
interface NotificationProps {
  message: string;
  type: 'error' | 'success' | 'info';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const baseClasses = "fixed bottom-5 right-5 p-4 rounded-lg shadow-xl flex items-center transition-all duration-300 transform z-50";
  let colorClasses = "";

  switch (type) {
    case 'error':
      colorClasses = "bg-red-500 text-white";
      break;
    case 'success':
      colorClasses = "bg-green-500 text-white";
      break;
    case 'info':
      colorClasses = "bg-blue-500 text-white";
      break;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      <span className="mr-4 text-sm font-medium">{message}</span>
      <button onClick={onClose} className="p-1 -mr-2 -my-2 rounded-full hover:bg-white/20 transition">
        <X size={16} />
      </button>
    </div>
  );
};

// ------------------------------------------------------------------------------------------------
// 4. Componente de Confirmação (MANTIDO)
// ------------------------------------------------------------------------------------------------
interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  itemIdentifier: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel, itemIdentifier }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm">
      <h3 className="text-xl font-bold text-red-600 mb-4">Confirmação Necessária</h3>
      <p className="text-gray-700 mb-6">
        {message} 
        <span className="font-semibold">{itemIdentifier}</span>?
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-md"
        >
          Excluir
        </button>
      </div>
    </div>
  </div>
);

// ------------------------------------------------------------------------------------------------
// 5. Componente da Linha de Usuário (MANTIDO)
// ------------------------------------------------------------------------------------------------
interface UserRowProps {
  user: User;
  onDelete: (id: number) => void;
  onEdit: (user: User) => void; 
  isLoading: boolean;
}

const UserRow: React.FC<UserRowProps> = ({ user, onDelete, onEdit, isLoading }) => (
  <div className="flex justify-between items-center bg-white p-4 my-2 rounded-xl shadow-sm hover:shadow-md transition duration-200">
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-lg text-gray-800 truncate">{user.nome}</p>
      <p className="text-sm text-gray-500 truncate">{user.email} - ({user.idade} anos)</p>
    </div>
    <div className="flex items-center space-x-2 ml-4">
      {/* Botão de Edição */}
      <button
        onClick={() => onEdit(user)}
        disabled={isLoading}
        className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 disabled:opacity-50 transition"
        title="Editar Usuário"
      >
        <Edit size={18} />
      </button>

      {/* Botão de Exclusão */}
      <button
        onClick={() => onDelete(user.id)}
        disabled={isLoading}
        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 disabled:opacity-50 transition"
        title="Excluir Usuário"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);


// ------------------------------------------------------------------------------------------------
// 6. Componente da Lista de Usuários (MANTIDO)
// ------------------------------------------------------------------------------------------------
interface UserListProps {
  users: User[];
  isLoading: boolean;
  onUserDelete: (id: number) => void;
  onUserEdit: (user: User) => void; 
  error: string | null;
}

const UserList: React.FC<UserListProps> = ({ users, isLoading, onUserDelete, onUserEdit, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className="ml-3 text-lg text-gray-600">Carregando usuários...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg">
        <p className="font-bold">Erro ao carregar dados:</p>
        <p>{error}</p>
        <p className="mt-2 text-sm">Verifique se o backend está rodando em {API_BASE_URL} (ou se o mock está quebrado).</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-lg text-center">
        <p className="font-bold">Nenhum usuário encontrado.</p>
        <p>Use o formulário para adicionar novos usuários.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <UserRow 
          key={user.id} 
          user={user} 
          onDelete={onUserDelete} 
          onEdit={onUserEdit} 
          isLoading={isLoading} 
        />
      ))}
    </div>
  );
};

// ------------------------------------------------------------------------------------------------
// 7. Componente de Criação de Usuário (MANTIDO)
// ------------------------------------------------------------------------------------------------
interface CreateUserFormProps {
    onUserCreated: (newUser: User) => void;
    onClose: () => void;
    onNotify: (message: string, type: 'error' | 'success') => void;
    isSubmitting: boolean;
    setIsSubmitting: (value: boolean) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onUserCreated, onClose, onNotify, isSubmitting, setIsSubmitting }) => {
    const [formData, setFormData] = useState<UserPayload>({
        nome: '',
        idade: 0,
        email: '',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'idade' ? parseInt(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (!formData.nome || !formData.email || formData.idade <= 0) {
            onNotify("Preencha todos os campos corretamente (idade > 0).", 'error');
            setIsSubmitting(false);
            return;
        }

        try {
            const newUser = await createUser(formData);
            onUserCreated(newUser);
            onNotify(`Usuário '${newUser.nome}' criado com sucesso!`, 'success');
            onClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao criar usuário.';
            onNotify(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-indigo-700">Criar Novo Usuário</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Nome completo"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="exemplo@dominio.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Idade</label>
                            <input
                                type="number"
                                name="idade"
                                value={formData.idade || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                min="1"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-md disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 size={16} className="animate-spin mr-2" />
                            ) : (
                                <Save size={16} className="mr-2" />
                            )}
                            {isSubmitting ? 'Salvando...' : 'Salvar Usuário'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// ------------------------------------------------------------------------------------------------
// 8. Componente de Edição de Usuário (MANTIDO)
// ------------------------------------------------------------------------------------------------
interface EditUserFormProps {
    user: User;
    onUserUpdated: (updatedUser: User) => void;
    onClose: () => void;
    onNotify: (message: string, type: 'error' | 'success') => void;
    isSubmitting: boolean;
    setIsSubmitting: (value: boolean) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onUserUpdated, onClose, onNotify, isSubmitting, setIsSubmitting }) => {
    // Inicializa o estado do formulário com os dados atuais do usuário
    const [formData, setFormData] = useState<Partial<UserPayload>>({
        nome: user.nome,
        idade: user.idade,
        email: user.email,
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'idade' ? parseInt(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Validação (usando o valor atual ou o valor do formulário)
        const nome = formData.nome ?? user.nome;
        const email = formData.email ?? user.email;
        const idade = formData.idade ?? user.idade;


        if (!nome || !email || idade <= 0) {
            onNotify("Preencha todos os campos corretamente (idade > 0).", 'error');
            setIsSubmitting(false);
            return;
        }

        try {
            const updatedUser = await updateUser(user.id, formData);
            
            onUserUpdated(updatedUser); 
            onNotify(`Usuário '${updatedUser.nome}' atualizado com sucesso!`, 'success');
            onClose(); 
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao atualizar usuário.';
            onNotify(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-yellow-700">Editar Usuário ID: {user.id}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome</label>
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500"
                                placeholder="Nome completo"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500"
                                placeholder="exemplo@dominio.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Idade</label>
                            <input
                                type="number"
                                name="idade"
                                value={formData.idade || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500"
                                min="1"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition shadow-md disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 size={16} className="animate-spin mr-2" />
                            ) : (
                                <Save size={16} className="mr-2" />
                            )}
                            {isSubmitting ? 'Atualizando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ------------------------------------------------------------------------------------------------
// 9. Componentes de Card (MANTIDOS)
// ------------------------------------------------------------------------------------------------

interface CardRowProps {
  card: Card;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

const CardRow: React.FC<CardRowProps> = ({ card, onDelete, isLoading }) => (
    <div className="flex flex-col sm:flex-row items-center bg-white p-4 my-2 rounded-xl shadow-sm hover:shadow-lg transition duration-200 border border-gray-100">
        <img 
            src={card.imagem} 
            alt={`Imagem do Card ID ${card.id}`} 
            className="w-16 h-16 object-cover rounded-md mr-4 mb-4 sm:mb-0 shadow"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/64x64/cccccc/444444?text=Card' }}
        />
        <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg text-purple-800">Card ID: {card.id} ({card.tipo})</p>
            <p className="text-sm text-gray-500">Nível: {card.nivel} | Classe: {card.classe}</p>
        </div>
        <button
            onClick={() => onDelete(card.id)}
            disabled={isLoading}
            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 disabled:opacity-50 transition mt-3 sm:mt-0 ml-4"
            title="Excluir Card"
        >
            <Trash2 size={18} />
        </button>
    </div>
);

interface CardListProps {
  cards: Card[];
  isLoading: boolean;
  onCardDelete: (id: number) => void;
  error: string | null;
}

const CardList: React.FC<CardListProps> = ({ cards, isLoading, onCardDelete, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-purple-500" size={32} />
        <span className="ml-3 text-lg text-gray-600">Carregando cards...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg">
        <p className="font-bold">Erro ao carregar dados:</p>
        <p>{error}</p>
        <p className="mt-2 text-sm">Verifique se o backend está rodando em {API_BASE_URL} (ou se o mock está quebrado).</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-lg text-center">
        <p className="font-bold">Nenhum card encontrado.</p>
        <p>Crie um Card DEMO para popular a lista.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <CardRow 
          key={card.id} 
          card={card} 
          onDelete={onCardDelete} 
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};


// ------------------------------------------------------------------------------------------------
// 10. Componente Principal da Aplicação
// ------------------------------------------------------------------------------------------------

// DEFINIÇÃO DO COMPONENTE PRINCIPAL
// MUDANÇA ESSENCIAL: EXPORT DEFAULT PARA RESOLVER O ERRO TS(1192)
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
  const [confirmModalData, setConfirmModalData] = useState<{ id: number, type: 'user' | 'card', itemIdentifier: string } | null>(null);

  // === ESTADOS DE NOTIFICAÇÃO ===
  const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' | 'info' } | null>(null);
  
  // ------------------------------------------------------------------------------------------------
  // 10.1. Funções de Notificação
  // ------------------------------------------------------------------------------------------------
  const handleNotify = useCallback((message: string, type: 'error' | 'success' | 'info') => {
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
    
    setConfirmModalData(null);
    setIsSubmitting(true);
    
    try {
      await deleteUser(confirmModalData.id);
      setUsers(prev => prev.filter(u => u.id !== confirmModalData.id));
      handleNotify(`Usuário '${confirmModalData.itemIdentifier}' excluído com sucesso.`, 'success');
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
    
    setConfirmModalData(null);
    setIsSubmitting(true);
    
    try {
      await deleteCard(confirmModalData.id);
      setCards(prev => prev.filter(c => c.id !== confirmModalData.id));
      handleNotify(`Card '${confirmModalData.itemIdentifier}' excluído com sucesso.`, 'success');
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
          message={`Tem certeza que deseja excluir permanentemente `}
          itemIdentifier={confirmModalData.itemIdentifier}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmModalData(null)}
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