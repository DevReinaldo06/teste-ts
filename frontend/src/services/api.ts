// frontend/src/services/api.ts

// CORREÇÃO: Usando 'import type' para importar interfaces (User, Card, etc.) e ajustando o path
import type { User, Card, UserPayload, CardPayload, ApiErrorResponse } from '../types/index.js'; 

// URL base da sua API de backend
const API_BASE_URL = 'http://localhost:3000'; 

/**
 * Função utilitária para lidar com a resposta do fetch, incluindo tratamento de erros customizados.
 */
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorData: ApiErrorResponse = { message: 'Erro na requisição.' };
        try {
            // Tenta ler o corpo do erro (onde a API coloca a mensagem de erro)
            errorData = await response.json();
        } catch (e) {
            // Se falhar ao parsear, usa a mensagem HTTP default
            errorData.message = `Erro HTTP ${response.status}.`;
        }
        // Lança um erro com a mensagem da API para ser tratado pelo componente/hook
        throw new Error(errorData.message); 
    }
    
    // Se a resposta for 204 (No Content, como no DELETE), retorna void
    if (response.status === 204) {
        return {} as T; // Retorna um objeto vazio que será ignorado
    }

    return response.json() as Promise<T>;
}

// ----------------------------------------------------
// Funções CRUD para Usuários (/users)
// ----------------------------------------------------

// O tipo de retorno é User[], então precisamos do tipo User
export const getUsers = async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return handleResponse<User[]>(response);
};

// O argumento é UserPayload e o retorno é User
export const createUser = async (data: UserPayload): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<User>(response);
};

// NOVO: Função para atualizar um usuário existente
export const updateUser = async (id: number, data: Partial<UserPayload>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<User>(response);
};

// O retorno é void
export const deleteUser = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<void>(response);
};

// ----------------------------------------------------
// Funções CRUD para Cards (/cards)
// ----------------------------------------------------

// O retorno é Card[]
export const getCards = async (): Promise<Card[]> => {
    const response = await fetch(`${API_BASE_URL}/cards`);
    return handleResponse<Card[]>(response);
};

// O argumento é CardPayload e o retorno é Card
export const createCard = async (data: CardPayload): Promise<Card> => {
    const response = await fetch(`${API_BASE_URL}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<Card>(response);
};

// O retorno é Card
export const updateCard = async (id: number, data: Partial<CardPayload>): Promise<Card> => {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return handleResponse<Card>(response);
};

// O retorno é void
export const deleteCard = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<void>(response);
};