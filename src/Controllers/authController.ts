import { Request, Response, NextFunction } from 'express';
import * as authService from '../Services/authService';
import * as userService from '../Services/userService'; // Para lógica de cadastro
import { BadRequestError } from '../errors/ApiError';

// ----------------------------------------------------------------
// Lógica de Login
// ----------------------------------------------------------------
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new BadRequestError('E-mail e senha são obrigatórios.');
        }
        
        // Assumindo que authService.login existe e funciona
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
// Lógica de Registro (CORRIGIDA)
// ----------------------------------------------------------------
export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new BadRequestError('E-mail e senha são obrigatórios para o registro.');
        }

        // 💡 CORREÇÃO: Chamando a função exportada do Service: registerUser
        const newUser = await userService.registerUser(email, password);

        return res.status(201).json({
            message: 'Usuário registrado com sucesso.',
            user: newUser,
        });

    } catch (error) {
        next(error);
    }
}

// ----------------------------------------------------------------
// Lógica de Login Admin (Endpoint de Verificação da Chave Secreta)
// ----------------------------------------------------------------
export async function adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const { adminKey } = req.body;

        if (!adminKey) {
            throw new BadRequestError('A chave de acesso administrativa é obrigatória.');
        }

        // Assumindo que authService.verifyAdminKey existe e funciona
        const isAdminKeyValid = await authService.verifyAdminKey(adminKey);

        if (!isAdminKeyValid) {
            throw new BadRequestError('Chave de acesso administrativa inválida.');
        }
        
        return res.status(200).json({
            message: 'Chave administrativa válida. Prossiga com o login de usuário e token será atualizado.',
            adminKeyValid: true,
        });
        
    } catch (error) {
        next(error);
    }
}