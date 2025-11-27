// frontend/src/types/index.ts

/**
 * Interface que representa um registro de Usuário conforme retornado pela API.
 */
export interface User {
    id: number;
    nome: string;
    idade: number;
    email: string;
}

/**
 * Interface para os dados de criação ou atualização de Usuário (excluindo 'id').
 */
export type UserPayload = Omit<User, 'id'>;

/**
 * Interface que representa um registro de Card conforme retornado pela API.
 */
export interface Card {
    id: number;
    imagem: string; // URL da imagem
    tipo: string;
    nivel: number;
    classe: string;
}

/**
 * Interface para os dados de criação ou atualização de Card (excluindo 'id').
 */
export type CardPayload = Omit<Card, 'id'>;


/**
 * Interface genérica para respostas de erro da API.
 */
export interface ApiErrorResponse {
    message: string;
}