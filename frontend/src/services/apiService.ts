import { Card, User } from '../types/gameTypes';

// A URL base do backend (ajuste se necessário)
const API_BASE_URL = 'http://localhost:3000';

// -------------------------
// 🔐 Helper para Header com Token
// -------------------------
function authHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        // Certifica-se de que o token existe antes de incluí-lo
        ...(token && { "Authorization": `Bearer ${token}` }), 
    };
}

// -------------------------
// 🔑 AUTHENTICATION
// -------------------------
/**
 * Tenta fazer login com as credenciais fornecidas.
 * @param credentials - Objeto contendo email/username e password.
 * @returns Um objeto contendo dados do usuário e o token de acesso.
 */
export const loginUser = async (credentials: any) => {
    // A URL padrão para login em backends como o JSON Server Auth é /login
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        // Tenta pegar a mensagem de erro do backend
        const errorData = await response.json();
        // Lança um erro para ser capturado no AuthPage
        throw new Error(errorData.message || 'Falha na autenticação. Verifique as credenciais.');
    }

    // Retorna o objeto (geralmente { accessToken, user })
    return await response.json(); 
};

// -------------------------
// 👤 USER PROFILE OPERATIONS
// -------------------------

/**
 * Atualiza os dados de um usuário existente.
 * @param user - O objeto User completo com os dados atualizados.
 */
export const updateUserProfile = async (user: User) => {
    // Rota PUT para o ID do usuário: /users/:id
    const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(user),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar perfil do usuário.');
    }
    
    // Retorna o objeto do usuário atualizado, se a API o fizer
    return await response.json();
};

/**
 * Exclui um usuário (e seu perfil) do banco de dados pelo ID.
 * @param id - O ID do usuário a ser excluído.
 */
export const deleteUser = async (id: string) => {
    // Rota DELETE para o ID do usuário: /users/:id
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: authHeaders(), // Usando o token de autenticação
    });
    
    if (!response.ok) {
        // Tenta pegar a mensagem de erro do backend
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao excluir o usuário.');
    }
    
    // Retorna true ou a resposta, indicando sucesso na exclusão.
    return true; 
};

// -------------------------
// 📌 CARD CRUD OPERATIONS
// -------------------------
export const addCard = async (card: Omit<Card, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/cards`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(card),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao adicionar card.');
    }
};

export const updateCard = async (card: Card) => {
    const response = await fetch(`${API_BASE_URL}/cards/${card.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(card),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao atualizar card.');
    }
};

export const deleteCard = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao excluir card.');
    }
};

// -------------------------
// 📌 DATA FETCHING
// -------------------------
export const fetchAllCards = async (): Promise<Card[]> => {
    const response = await fetch(`${API_BASE_URL}/cards`, {
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error('Falha ao carregar cards da API.');
    }

    return await response.json();
};

export const fetchAllUsers = async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        headers: authHeaders(),
    });

    if (!response.ok) {
        throw new Error('Falha ao carregar usuários da API.');
    }

    return await response.json();
};

// -------------------------
// (Opcional) Função para Registrar Novo Usuário
// -------------------------
export const registerUser = async (user: Omit<User, 'id'>) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao registrar novo usuário.');
    }

    // Retorna o objeto do usuário recém-criado e o token
    return await response.json();
};