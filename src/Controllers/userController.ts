// Conteúdo anterior + novos métodos

import { Request, Response, NextFunction } from 'express';
import * as userService from '../Services/userService';
import { BadRequestError, NotFoundError } from '../errors/ApiError'; // Adiciona NotFoundError

// ----------------------------------------------------------------
// ⚠️ NOVO: Lógica de Cadastro (POST /users)
// ----------------------------------------------------------------
export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new BadRequestError('E-mail e senha são obrigatórios para o cadastro.');
        }
        
        // Validação básica de formato de senha (opcional)
        if (password.length < 6) {
             throw new BadRequestError('A senha deve ter pelo menos 6 caracteres.');
        }

        const newUser = await userService.registerUser(email, password);
        
        // Retorna 201 Created
        return res.status(201).json({ 
            message: 'Usuário cadastrado com sucesso. Por favor, faça login.', 
            user: newUser 
        });

    } catch (error) {
        next(error);
    }
}


// ----------------------------------------------------------------
// ATUALIZADO: Lógica de Atualização (PUT /users/:id)
// ----------------------------------------------------------------
export async function updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        // Pega o ID do usuário injetado pelo middleware 'authenticate'
        const userId = req.user!.id; 

        // Adiciona validação de que o ID do token é o mesmo que o ID da rota (se usar /users/:id)
        // Aqui, presumimos que a rota é /users/me, ou que o usuário só edita a si mesmo.
        // Se a rota fosse /users/:id, seria necessário verificar se o usuário é Admin.

        if (!email && !password) {
            throw new BadRequestError('Nenhum dado fornecido para atualização. Forneça e-mail ou senha.');
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
// ATUALIZADO: Lógica de Busca (GET /users/:id)
// ----------------------------------------------------------------
export async function getProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id; // Pega o ID do usuário injetado pelo middleware 'authenticate'
        
        const user = await userService.getUserById(userId);

        // Remove dados sensíveis ou desnecessários antes de enviar ao cliente
        const { id, email, isAdmin } = user;
        
        return res.status(200).json({ id, email, isAdmin });

    } catch (error) {
        next(error);
    }
}