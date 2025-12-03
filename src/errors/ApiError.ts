// src/errors/ApiError.ts

/**
 * Erro genérico para falhas na API, incluindo o status HTTP.
 */
export class ApiError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}

/**
 * Erro 404: Recurso não encontrado.
 */
export class NotFoundError extends ApiError {
    constructor(message: string = "Recurso não encontrado.") {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

/**
 * Erro 400: Requisição inválida.
 */
export class BadRequestError extends ApiError {
    constructor(message: string = "Requisição inválida. Verifique os dados enviados.") {
        super(message, 400);
        this.name = 'BadRequestError';
    }
}

/**
 * Erro 401: Não Autorizado. (Falha de Autenticação)
 */
export class UnauthorizedError extends ApiError {
    constructor(message: string = "Acesso não autorizado ou credenciais inválidas.") {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

/**
 * Erro 409: Conflito (violação de unicidade).
 */
export class ConflictError extends ApiError {
    constructor(message: string = "Conflito de dados. O recurso já existe ou o campo unique está duplicado.") {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

/**
 * Erro 500: Erro interno do servidor.
 */
export class InternalServerError extends ApiError {
    constructor(message: string = "Erro interno do servidor.") {
        super(message, 500);
        this.name = 'InternalServerError';
    }
}