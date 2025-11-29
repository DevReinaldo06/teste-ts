import React, { useState } from 'react';
import Modal from './Modal';
import { FormInput, FormSelect, AdminNavButton } from './FormElements';
import { Card, User, TipoType, NivelType, ElementoType, TIPO_OPTIONS, NIVEL_OPTIONS, ELEMENTO_OPTIONS } from '../types/gameTypes';

// Formulário de Cadastro/Edição de Card
export const CardForm: React.FC<{
  card?: Card;
  onSubmit: (card: Omit<Card, 'id'> | Card) => void;
  isEdit?: boolean;
}> = ({ card, onSubmit, isEdit = false }) => {
  const [name, setName] = useState(card?.name || '');
  const [imagem, setImagem] = useState(card?.imagem || '');
  const [imagemRevelada, setImagemRevelada] = useState(card?.imagemRevelada || '');
  const [tipo, setTipo] = useState<TipoType>(card?.tipo || TIPO_OPTIONS[0]);
  const [nivel, setNivel] = useState<NivelType>(card?.nivel || NIVEL_OPTIONS[0]);
  const [elemento, setElemento] = useState<ElementoType>(card?.elemento || ELEMENTO_OPTIONS[0]);
  const [classe, setClasse] = useState(card?.classe || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cardData = { name, imagem, imagemRevelada, tipo, nivel, elemento, classe };
    if (isEdit && card) {
      onSubmit({ ...cardData, id: card.id } as Card);
    } else {
      onSubmit(cardData as Omit<Card, 'id'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput label="Nome" value={name} onChange={setName} required />
      <FormInput label="URL Imagem Oculta" value={imagem} onChange={setImagem} required />
      <FormInput label="URL Imagem Revelada" value={imagemRevelada} onChange={setImagemRevelada} required />
      <FormInput label="Classe" value={classe} onChange={setClasse} required />

      <FormSelect label="Tipo" value={tipo} options={TIPO_OPTIONS} onChange={(e) => setTipo(e.target.value as TipoType)} />
      <FormSelect label="Nível" value={nivel} options={NIVEL_OPTIONS} onChange={(e) => setNivel(parseInt(e.target.value) as NivelType)} />
      <FormSelect label="Elemento" value={elemento} options={ELEMENTO_OPTIONS} onChange={(e) => setElemento(e.target.value as ElementoType)} />

      <button
        type="submit"
        className={`w-full py-2 rounded-lg font-semibold transition ${isEdit ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
      >
        {isEdit ? 'Salvar Alterações do Card' : 'Cadastrar Card'}
      </button>
    </form>
  );
};


// Lista de Cards (Admin)
export const CardList: React.FC<{
  cards: Card[];
  onUpdate: (card: Card) => Promise<void>;
  onDelete: (id: string, name: string) => void; 
}> = ({ cards, onUpdate, onDelete }) => {
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  const handleEditSubmit = (card: Card | Omit<Card, 'id'>) => {
    onUpdate(card as Card);
    setEditingCard(null);
  };

  if (cards.length === 0) {
    return <p className="text-center py-10 text-gray-500 dark:text-gray-400">Nenhum card cadastrado.</p>;
  }

  return ( // Retorno explícito
    <div className="space-y-4">
      {cards.map((card) => (
        <div key={card.id} className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 flex justify-between items-center transition hover:shadow-md">
          <div className="text-sm">
            <p className="font-bold text-lg dark:text-white">{card.name}</p>
            <p className="text-gray-600 dark:text-gray-300">Tipo: {card.tipo} | Nível: {card.nivel} | Elemento: {card.elemento}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setEditingCard(card)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm transition"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(card.id, card.name)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}

      {/* Modal de Edição de Card */}
      <Modal
        isOpen={!!editingCard}
        onClose={() => setEditingCard(null)}
        title={`Editar Card: ${editingCard?.name}`}
      >
        {editingCard && (
          <CardForm
            card={editingCard}
            onSubmit={handleEditSubmit}
            isEdit={true}
          />
        )}
      </Modal>
    </div>
  );
};


// Lista de Usuários (Admin)
export const UserList: React.FC<{
  users: User[];
  onUpdate: (user: User) => Promise<void>;
  onDelete: (id: string, email: string) => void;
}> = ({ users, onUpdate, onDelete }) => {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setNewEmail(user.email);
    setNewPassword(user.password || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdate({ ...editingUser, email: newEmail, password: newPassword });
      setEditingUser(null);
    }
  };

  // Filtra o Admin Temporário da lista real de usuários do banco
  const filteredUsers = users.filter(u => u.id !== 'admin-temp-id');

  if (filteredUsers.length === 0) {
    return <p className="text-center py-10 text-gray-500 dark:text-gray-400">Nenhum usuário cadastrado (excluindo admins temporários).</p>;
  }

  return ( // <--- CORREÇÃO: RETORNO EXPLÍCITO AQUI
    <div className="space-y-4">
      {filteredUsers.map((user) => (
        <div key={user.id} className="p-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 flex justify-between items-center transition hover:shadow-md">
          <div className="text-sm">
            <p className="font-bold text-lg dark:text-white">{user.email} {user.isAdmin ? '(Admin)' : ''}</p>
            <p className="text-gray-600 dark:text-gray-300">ID: {user.id}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => openEditModal(user)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm transition"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(user.id, user.email)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}

      {/* Modal de Edição de Usuário */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title={`Editar Usuário: ${editingUser?.email}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
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