/**
 * Erro genérico para falhas na API, incluindo o status HTTP.
 * Esta classe será estendida por erros específicos.
 */
export class ApiError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        // Chama o construtor da classe base (Error)
        super(message);
        // Define um nome para o tipo de erro (útil para logs)
        this.name = 'ApiError';
        // Armazena o código de status HTTP
        this.statusCode = statusCode;
    }
}

/**
 * Erro 404: Recurso não encontrado.
 * Usado quando o Prisma retorna P2025 (registro não encontrado) ou um recurso não existe.
 */
export class NotFoundError extends ApiError {
    constructor(message: string = "Recurso não encontrado.") {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

/**
 * Erro 400: Requisição inválida (falha na validação do Controller/Service).
 */
export class BadRequestError extends ApiError {
    constructor(message: string = "Requisição inválida. Verifique os dados enviados.") {
        super(message, 400);
        this.name = 'BadRequestError';
    }
}

/**
 * Erro 409: Conflito (violação de unicidade, como um email duplicado).
 * Usado quando o Prisma retorna P2002 (campo unique duplicado).
 */
export class ConflictError extends ApiError {
    constructor(message: string = "Conflito de dados. O recurso já existe ou o campo unique está duplicado.") {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

/**
 * Erro 500: Erro interno do servidor.
 * Usado para erros inesperados que não foram mapeados (fallback de exceções).
 */
export class InternalServerError extends ApiError {
    constructor(message: string = "Erro interno do servidor.") {
        super(message, 500);
        this.name = 'InternalServerError';
    }
}