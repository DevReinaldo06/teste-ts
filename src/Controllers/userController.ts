// src/Controllers/userController.ts

import { Request, Response, NextFunction } from 'express';
import * as userService from '../Services/userService'; 
import * as adminUserService from '../Services/adminUserService'; 
import { BadRequestError } from '../errors/ApiError';

// ----------------------------------------------------------------
// 👤 Funções de Usuário Padrão 
// ----------------------------------------------------------------

/**
 * 📝 POST /users - Registra um novo usuário.
 */
export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        
        const newUser = await userService.registerUser(email, password);
        
        return res.status(201).json({ 
            message: 'Usuário cadastrado com sucesso. Por favor, faça login.', 
            user: newUser 
        });

    } catch (error) {
        next(error);
    }
}

/**
 * 🔍 GET /users/me - Busca o perfil do usuário logado.
 */
export async function getProfile(req: Request, res: Response, next: NextFunction) {
    try {
        // ID injetado pelo middleware de autenticação
        const userId = req.user!.id; 
        
        const user = await userService.getUserById(userId);

        const { id, email, isAdmin } = user;
        
        return res.status(200).json({ id, email, isAdmin });

    } catch (error) {
        next(error);
    }
}

/**
 * ✏️ PUT /users/me - Atualiza o perfil do usuário logado.
 */
export async function updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const userId = req.user!.id; 

        const updatedUser = await userService.updateUserDetails(userId, email, password);
        
        return res.status(200).json({ 
            message: 'Perfil atualizado com sucesso.', 
            user: updatedUser 
        });

    } catch (error) {
        next(error);
    }
}

// ----------------------------------------------------------------
// 👑 Funções Administrativas (Importadas para usar o service padrão de busca)
// ----------------------------------------------------------------

/**
 * 📋 GET /admin/users - Lista todos os usuários.
 */
export async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await adminUserService.getAllUsersForAdmin(); 
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

/**
 * 🔎 GET /admin/users/:id - Busca qualquer usuário por ID.
 */
export async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new BadRequestError('O ID do usuário deve ser um número válido.');
        }

        const user = await userService.getUserById(id); 
        
        const { id: userId, email, isAdmin } = user;
        
        return res.status(200).json({ id: userId, email, isAdmin });

    } catch (error) {
        next(error);
    }
}

/**
 * 🗑️ DELETE /admin/users/:id - Exclui um usuário.
 */
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new BadRequestError('O ID do usuário deve ser um número válido.');
        }

        await adminUserService.deleteUser(id); 
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}