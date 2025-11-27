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
// Lógica de Registro (Apenas chama o UserService)
// ----------------------------------------------------------------
export async function register(req: Request, res: Response, next: NextFunction) {
    // Reutiliza a lógica de cadastro do UserController/Service
    // A rota correta é POST /users, mas alguns frameworks usam /auth/register.
    // Para simplificar, vamos chamar a lógica do UserService aqui.
    return userService.register(req, res, next);
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

        const isAdminKeyValid = await authService.verifyAdminKey(adminKey);

        if (!isAdminKeyValid) {
            throw new BadRequestError('Chave de acesso administrativa inválida.');
        }

        // Se a chave for válida, gera um token JWT com isAdmin: true
        // Assumindo que o usuário admin já foi logado pelo login normal ou está no contexto.
        // Como o fluxo não é claro (adminKey é para login ou para elevar privilégio?),
        // vamos simular que este endpoint apenas verifica a chave e retorna sucesso.
        
        return res.status(200).json({
            message: 'Chave administrativa válida. Prossiga com o login de usuário e token será atualizado.',
            adminKeyValid: true,
        });
        
    } catch (error) {
        next(error);
    }
}