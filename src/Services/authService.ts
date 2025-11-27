import prisma from '../db/prisma';
import { comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { NotFoundError, BadRequestError } from '../errors/ApiError';

/**
 * Lógica de Autenticação (Login).
 * @param email Email do usuário.
 * @param password Senha em texto simples.
 * @returns Token JWT e dados do usuário.
 */
export async function login(email: string, password: string): Promise<{ token: string, user: { id: number, email: string, isAdmin: boolean } }> {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        // Por segurança, use uma mensagem genérica para não revelar qual dado está errado.
        throw new BadRequestError('Credenciais inválidas. Verifique seu e-mail e senha.');
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
        throw new BadRequestError('Credenciais inválidas. Verifique seu e-mail e senha.');
    }

    const token = generateToken({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
    });
    
    // Retorna o token e dados básicos do usuário (sem a senha)
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        }
    };
}

/**
 * Lógica de Login Admin (Verificação da Chave Secreta).
 * @param adminKey Chave secreta fornecida.
 * @returns true se a chave for válida.
 */
export async function verifyAdminKey(adminKey: string): Promise<boolean> {
    const adminConfig = await prisma.adminConfig.findUnique({
        where: { id: 1 }, // O AdminConfig deve ter sempre o ID 1
    });

    if (!adminConfig || !adminConfig.adminKeyHash) {
        // O hash da chave não foi criado (erro de inicialização do DB)
        throw new NotFoundError('Configuração de Admin não inicializada no sistema.');
    }

    // Compara a chave fornecida com o hash guardado
    const match = await comparePassword(adminKey, adminConfig.adminKeyHash);
    
    return match;
}