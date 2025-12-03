// src/Services/authService.ts

import { prisma } from '../db/prisma';
import { comparePassword } from '../utils/bcrypt';
import { createToken } from '../utils/jwt';
import { UnauthorizedError, NotFoundError } from '../errors/ApiError';

/**
 * Realiza o login do usuário.
 */
export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new UnauthorizedError('E-mail ou senha inválidos.');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new UnauthorizedError('E-mail ou senha inválidos.');
    }

    const payload = {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
    };

    const token = createToken(payload);

    return { 
        token, 
        user: payload 
    };
}

/**
 * Verifica se a chave de acesso administrativa fornecida está correta.
 */
export async function verifyAdminKey(key: string): Promise<boolean> {
    const adminConfig = await prisma.adminConfig.findUnique({
        where: { id: 1 },
    });

    if (!adminConfig) {
        throw new NotFoundError('Configuração de administrador não encontrada. Execute a inicialização do banco.');
    }

    // Compara a chave fornecida com o hash armazenado
    return comparePassword(key, adminConfig.adminKeyHash);
}