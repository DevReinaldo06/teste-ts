import { Request, Response, NextFunction } from 'express';
// Use os services específicos para cada camada
import * as userService from '../Services/userService'; // Para ações do próprio usuário (perfil)
import * as adminUserService from '../Services/adminUserService'; // Para ações administrativas (CRUD)
import { BadRequestError, NotFoundError } from '../errors/ApiError';

// ----------------------------------------------------------------
// 👤 Funções de Usuário Padrão (/users/register e /users/me)
// ----------------------------------------------------------------

/**
 * 📝 POST /users - Registra um novo usuário.
 * A validação é feita pelo Zod Middleware na camada de Rota.
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
 * Requer autenticação (middleware 'authenticate').
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
 * A validação é feita pelo Zod Middleware na camada de Rota.
 * Requer autenticação.
 */
export async function updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        const userId = req.user!.id; 

        // O Zod Schema (updateProfileSchema) garante que email OU password existam e sejam válidos.
        
        const updatedUser = await userService.updateUserDetails(userId, email, password);
        
        return res.status(200).json({ 
            message: 'Perfil atualizado com sucesso.', 
            user: updatedUser 
        });

    } catch (error) {
        next(error);
    }
}

// ---

// ----------------------------------------------------------------
// 👑 Funções Administrativas (Rotas /admin/users)
// ----------------------------------------------------------------

/**
 * 📋 GET /admin/users - Lista todos os usuários.
 * Requer autenticação e permissão de administrador ('isAdmin').
 */
export async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        // ⬅️ CORRIGIDO: Usa o adminUserService
        const users = await adminUserService.getAllUsersForAdmin(); 
        return res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

/**
 * 🔎 GET /admin/users/:id - Busca qualquer usuário por ID.
 * Requer autenticação e permissão de administrador.
 */
export async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new BadRequestError('O ID do usuário deve ser um número válido.');
        }

        // Usa o serviço padrão para buscar por ID (que omite o hash da senha)
        const user = await userService.getUserById(id); 
        
        const { id: userId, email, isAdmin } = user;
        
        return res.status(200).json({ id: userId, email, isAdmin });

    } catch (error) {
        next(error);
    }
}

/**
 * 🗑️ DELETE /admin/users/:id - Exclui um usuário.
 * Requer autenticação e permissão de administrador.
 */
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new BadRequestError('O ID do usuário deve ser um número válido.');
        }

        // ⬅️ CORRIGIDO: Usa o adminUserService
        await adminUserService.deleteUser(id); 
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        next(error);
    }
}