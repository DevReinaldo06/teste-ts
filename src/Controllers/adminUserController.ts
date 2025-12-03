// src/Controllers/adminUserController.ts

import { Request, Response, NextFunction } from 'express';
import * as adminUserService from '../Services/adminUserService';
import { BadRequestError } from '../errors/ApiError';

// ----------------------------------------------------------------
// GET /admin/users (Listar todos)
// ----------------------------------------------------------------
export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await adminUserService.getAllUsersForAdmin();
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

// ----------------------------------------------------------------
// PUT /admin/users/:id (Atualizar qualquer usuário)
// ----------------------------------------------------------------
export async function updateUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = parseInt(req.params.id);
        const { email, password, isAdmin } = req.body;

        if (isNaN(userId)) {
            throw new BadRequestError('O ID do usuário deve ser um número válido.');
        }

        const updatedUser = await adminUserService.updateAnyUser(userId, email, password, isAdmin);
        
        return res.status(200).json({ 
            message: 'Usuário atualizado com sucesso (Admin).', 
            user: updatedUser 
        });

    } catch (error) {
        next(error);
    }
}

// ----------------------------------------------------------------
// DELETE /admin/users/:id (Deletar qualquer usuário)
// ----------------------------------------------------------------
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = parseInt(req.params.id);

        if (isNaN(userId)) {
            throw new BadRequestError('O ID do usuário deve ser um número válido.');
        }

        await adminUserService.deleteUser(userId);
        
        return res.status(204).send();

    } catch (error) {
        next(error);
    }
}