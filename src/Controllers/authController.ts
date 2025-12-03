// src/Controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import * as authService from '../Services/authService';
import { BadRequestError, UnauthorizedError } from '../errors/ApiError'; 

// ----------------------------------------------------------------
// POST /auth/login (Login)
// ----------------------------------------------------------------
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        // A validação de campos obrigatórios é feita pelo Zod (loginSchema)
        
        const { token, user } = await authService.login(email, password);

        return res.status(200).json({
            token,
            user,
        });

    } catch (error) {
        next(error);
    }
}

// ----------------------------------------------------------------
// POST /auth/admin-key (Verificação da Chave Secreta)
// ----------------------------------------------------------------
export async function adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const { password } = req.body; 

        if (!password) {
            throw new BadRequestError('A chave de acesso administrativa é obrigatória.');
        }

        const isAdminKeyValid = await authService.verifyAdminKey(password); 

        if (!isAdminKeyValid) {
            throw new UnauthorizedError('Chave de acesso administrativa inválida.'); 
        }
        
        return res.status(200).json({
            message: 'Chave administrativa válida.',
            adminKeyValid: true,
        });
        
    } catch (error) {
        next(error);
    }
}