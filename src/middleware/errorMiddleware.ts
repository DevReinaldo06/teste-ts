// src/middleware/errorMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import { Prisma } from '@prisma/client';

// O middleware de erro do Express deve ter quatro argumentos
export default function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err); // Loga o erro completo no console do servidor

    if (err instanceof ApiError) {
        // Erros customizados (400, 401, 404, 409)
        return res.status(err.statusCode).json({
            message: err.message,
            status: err.statusCode,
        });
    }

    // Tratamento de Erros Comuns do Prisma (Ex: Violação de Chave Única)
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            const field = (err.meta?.target as string[])?.join(', ');
            return res.status(409).json({ 
                message: `Conflito de dados: O campo ${field} já existe.`, 
                status: 409 
            });
        }
        if (err.code === 'P2025') {
            return res.status(404).json({ 
                message: 'Recurso não encontrado.', 
                status: 404 
            });
        }
    }

    // Fallback para erros não tratados (500 Internal Server Error)
    return res.status(500).json({
        message: 'Erro interno do servidor. Consulte o log.',
        status: 500,
    });
}