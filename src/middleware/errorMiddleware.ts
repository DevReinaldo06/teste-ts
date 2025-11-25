import { Request, Response, NextFunction } from 'express';
import { ApiError, InternalServerError } from '../errors/ApiError';

/**
 * Middleware de tratamento de erros global.
 * Ele mapeia instâncias de ApiError para o status HTTP correto.
 * * Este middleware deve ser o último a ser registrado no seu arquivo index.ts 
 * para garantir que ele capture erros de todas as rotas e outros middlewares.
 */
const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    // O NextFunction é necessário pelo Express para identificar que este é um middleware de erro
    next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
    // Se o erro for uma instância de ApiError (NotFound, Conflict, etc.), 
    // usamos o status e a mensagem definidos nele.
    if (error instanceof ApiError) {
        // Loga o erro específico da API
        console.error(`[API Error ${error.statusCode}]: ${error.message}`, error);
        return res.status(error.statusCode).json({
            message: error.message,
        });
    }

    // Para todos os outros erros (erros internos, falhas de DB não mapeadas, erros de programação, etc.), 
    // respondemos com 500 (Erro Interno do Servidor).
    const internalError = new InternalServerError();
    // Loga o erro original para depuração
    console.error(`[Internal Server Error ${internalError.statusCode}]:`, error);
    
    return res.status(internalError.statusCode).json({
        message: internalError.message,
    });
};

export default errorMiddleware;