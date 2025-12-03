import { Request, Response, NextFunction } from 'express';
// Assumindo que estes caminhos e classes estão corretos
import * as userService from '../Services/userService.ts'; 
import * as adminUserService from '../Services/adminUserService.ts'; 
import { BadRequestError, NotFoundError } from '../errors/ApiError.ts';

// ----------------------------------------------------------------
// 👤 Funções de Usuário Padrão (Agora livres)
// ----------------------------------------------------------------

/**
 * 📝 POST /users/register - Registra um novo usuário.
 */
export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;
        // Validação básica (pode ser movida para um middleware)
        if (!email || !password) {
            throw new BadRequestError('Email e senha são obrigatórios para o registro.');
        }
        
        const newUser = await userService.createUser(email, password);
        
        return res.status(201).json({ 
            message: 'Usuário cadastrado com sucesso. Autenticação desativada.', 
            user: newUser 
        });

    } catch (error) {
        // Envia o erro para o middleware de tratamento de erros
        next(error);
    }
}

/**
 * 🔍 GET /users/me - Busca o primeiro usuário do banco (Simulação de perfil ativo, sem autenticação).
 */
export async function getProfile(req: Request, res: Response, next: NextFunction) {
    try {
        // Busca o primeiro usuário para simular um perfil ativo sem a necessidade de autenticação.
        const user = await userService.getFirstUser();

        if (!user) {
            throw new NotFoundError('Nenhum usuário encontrado no sistema.');
        }

        const { id, email, isAdmin } = user;
        
        return res.status(200).json({ id, email, isAdmin });

    } catch (error) {
        next(error);
    }
}

/**
 * ✏️ PUT /users/me - Atualiza o perfil. Requer 'id' no corpo para simulação.
 */
export async function updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, email, password } = req.body; 
        
        if (!id) {
            throw new BadRequestError('O ID do usuário é obrigatório para atualização sem autenticação.');
        }

        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            throw new BadRequestError('ID do usuário deve ser um número válido.');
        }

        const updatedUser = await userService.updateUserDetails(userId, email, password);
        
        return res.status(200).json({ 
            message: 'Perfil atualizado com sucesso (Autenticação desativada).', 
            user: updatedUser 
        });

    } catch (error) {
        next(error);
    }
}

// ----------------------------------------------------------------
// 👑 Funções Administrativas (Totalmente públicas)
// ----------------------------------------------------------------

/**
 * 📋 GET /users - Lista todos os usuários.
 */
export async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await adminUserService.getAllUsersForAdmin(); 
        
        // 💡 CRÍTICO: Garantir que a resposta nunca seja nula. Se users for null ou undefined, retorna um array vazio.
        return res.status(200).json(users || []); 
    } catch (error) {
        next(error);
    }
}

/**
 * 🔎 GET /users/:id - Busca qualquer usuário por ID.
 */
export async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new BadRequestError('O ID do usuário deve ser um número válido.');
        }

        const user = await userService.getUserById(id); 
        
        if (!user) {
            throw new NotFoundError(`Usuário com ID ${id} não encontrado.`);
        }

        const { id: userId, email, isAdmin } = user;
        
        return res.status(200).json({ id: userId, email, isAdmin });

    } catch (error) {
        next(error);
    }
}

/**
 * 🗑️ DELETE /users/:id - Exclui um usuário.
 */
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new BadRequestError('O ID do usuário deve ser um número válido.');
        }

        await adminUserService.deleteUser(id); 
        // Retorno 204 (No Content) não deve ter corpo, mas o 200/202 pode ter. Usaremos 204.
        return res.status(204).send(); 
    } catch (error) {
        next(error);
    }
}