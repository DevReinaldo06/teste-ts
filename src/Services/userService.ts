// src/Services/userService.ts

import { prisma } from '../db/prisma';
import { hashPassword } from '../utils/bcrypt';
import { ConflictError, NotFoundError } from '../errors/ApiError';
// Adiciona o namespace Prisma, que contém os tipos de erro
import { User, Prisma } from '@prisma/client'; 

// Tipo de retorno para dados de usuário seguros (sem o hash da senha)
type UserSafe = Omit<User, 'password'>; 

/**
 * Lógica de Cadastro (Registro).
 */
export async function registerUser(email: string, password: string): Promise<UserSafe> {
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new ConflictError('Este e-mail já está cadastrado.');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            isAdmin: false, 
        },
        select: {
            id: true,
            email: true,
            isAdmin: true,
        },
    });

    return newUser;
}

/**
 * Busca o usuário por ID (para /users/me).
 */
export async function getUserById(id: number): Promise<UserSafe> {
    const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, isAdmin: true },
    });

    if (!user) {
        throw new NotFoundError('Usuário não encontrado.');
    }
    return user;
}

/**
 * Atualiza o perfil do usuário logado (/users/me).
 */
export async function updateUserDetails(userId: number, email?: string, password?: string): Promise<UserSafe> {
    const data: any = {};

    if (email) {
        // Verifica unicidade
        const existingUser = await prisma.user.findFirst({
            where: { email, NOT: { id: userId } }
        });
        if (existingUser) {
            throw new ConflictError('Este e-mail já está sendo utilizado por outro usuário.');
        }
        data.email = email;
    }

    if (password) {
        data.password = await hashPassword(password);
    }
    
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, email: true, isAdmin: true }
        });
        return updatedUser;
    } catch (error) {
        // CORRIGIDO: Agora Prisma está importado
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundError('Seu usuário não foi encontrado.');
        }
        throw error;
    }
}