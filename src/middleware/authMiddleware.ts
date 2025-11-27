import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../errors/ApiError';

// Estende a interface Request do Express para incluir o payload do usuário
declare module 'express' {
    export interface Request {
        user?: {
            id: number;
            email: string;
            isAdmin: boolean;
        };
    }
}

/**
 * Middleware para validar o token JWT e injetar o usuário na requisição.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new ApiError('Token não fornecido. Acesso negado.', 401));
    }

    const token = authHeader.split(' ')[1]; // Espera o formato "Bearer <token>"
    if (!token) {
        return next(new ApiError('Formato de token inválido.', 401));
    }

    const payload = verifyToken(token);

    if (!payload) {
        return next(new ApiError('Token inválido ou expirado.', 403));
    }

    // Injeta o payload do usuário na requisição para uso posterior
    req.user = payload;
    next();
};

/**
 * Middleware para verificar se o usuário autenticado é um Admin.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // Presume que o middleware 'authenticate' já foi executado
    if (!req.user || !req.user.isAdmin) {
        return next(new ApiError('Acesso restrito. Permissão de administrador necessária.', 403));
    }
    next();
};