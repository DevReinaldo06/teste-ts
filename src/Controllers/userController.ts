import { Request, Response, NextFunction } from 'express';
import * as userService from '../Services/userService';
import { BadRequestError, NotFoundError } from '../errors/ApiError';

// ----------------------------------------------------------------
// Funções de Usuário Padrão (Ex: /users/me, /register)
// ----------------------------------------------------------------

// POST /users/register ou POST /auth/register
export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new BadRequestError('E-mail e senha são obrigatórios para o cadastro.');
        }
        
        if (password.length < 6) {
            throw new BadRequestError('A senha deve ter pelo menos 6 caracteres.');
        }

        const newUser = await userService.registerUser(email, password);
        
        return res.status(201).json({ 
            message: 'Usuário cadastrado com sucesso. Por favor, faça login.', 
            user: newUser 
        });

    } catch (error) {
        next(error);
    }
}

// GET /users/me (Buscar o próprio perfil)
export async function getProfile(req: Request, res: Response, next: NextFunction) {
    try {
        // Assume que o ID foi injetado pelo middleware de autenticação
        const userId = req.user!.id; 
        
        const user = await userService.getUserById(userId);

        const { id, email, isAdmin } = user;
        
        return res.status(200).json({ id, email, isAdmin });

    } catch (error) {
        next(error);
    }
}

// PUT /users/me (Atualizar o próprio perfil)
export async function updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        // Assume que o ID foi injetado pelo middleware de autenticação
        const userId = req.user!.id; 

        if (!email && !password) {
            throw new BadRequestError('Nenhum dado fornecido para atualização. Forneça e-mail ou senha.');
        }

        if (password && password.length < 6) {
             throw new BadRequestError('A nova senha deve ter pelo menos 6 caracteres.');
        }

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
// Funções Administrativas (Requerem 'isAdmin' e usam o ID da Rota)
// ----------------------------------------------------------------

// GET /users (Listar todos os usuários)
// 💡 NOVO: Implementação para listar todos (Requer userService.getAllUsers)
export async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await userService.getAllUsers(); 
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

// GET /users/:id (Buscar qualquer usuário por ID)
// 💡 NOVO: Implementação para buscar por ID (Requer userService.getUserById)
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

// DELETE /users/:id (Excluir usuário)
// 💡 NOVO: Implementação para exclusão (Requer userService.deleteUser)
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new BadRequestError('O ID do usuário deve ser um número válido.');
        }

        await userService.deleteUser(id); 
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        next(error);
    }
}