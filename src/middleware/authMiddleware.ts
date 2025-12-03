// back/src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../errors/ApiError';

// Extensão da interface para permitir req.user
declare module 'express' {
    export interface Request {
        user?: {
            id: number;
            email: string;
            isAdmin: boolean;
        };
    }
}

// Rotas que DEVEM ser sempre públicas (não devem ser barradas pelo authenticate)
const PUBLIC_PATHS = [
    '/auth/login',
    '/auth/register',
    '/auth/admin-key',
];

/**
 * Middleware de autenticação baseado em JWT.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    
    const path = req.path.toLowerCase();

    // 🔑 CORREÇÃO CRÍTICA 1: Excluir rotas de autenticação
    if (PUBLIC_PATHS.includes(path)) {
        return next();
    }

    // 🔑 CORREÇÃO CRÍTICA 2: Excluir GET /cards
    // Se o frontend faz GET /cards antes de logar, deve ser permitido
    if (req.method === 'GET' && path === '/cards') {
        return next();
    }

    // 🟦 Ignorar preflight OPTIONS
    if (req.method === 'OPTIONS') {
        return next();
    }

    // 🟦 Ignorar favicon
    if (req.path === '/favicon.ico') {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        // CORREÇÃO CRÍTICA 3: Retornar JSON (evitar SyntaxError no frontend)
        return res.status(401).json({ message: 'Token não fornecido. Acesso negado.' });
    }

    // Esperado: "Bearer <token>"
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return next(new ApiError('Formato de token inválido.', 401));
    }

    try {
        const payload = verifyToken(token);

        if (!payload) {
            return next(new ApiError('Token inválido ou expirado.', 401));
        }

        // injeta usuário
        req.user = payload;

        next();
    } catch (error) {
         // Captura erro de verifyToken
         return next(new ApiError('Token inválido ou expirado.', 401));
    }
};

/**
 * Middleware de autorização de Administrador.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {

    if (!req.user) {
        return next(new ApiError('Usuário não autenticado.', 401));
    }

    if (!req.user.isAdmin) {
        return next(new ApiError('Acesso restrito. Permissão de administrador necessária.', 403));
    }

    next();
};