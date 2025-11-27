// Conteúdo anterior + lógica de hash e validação

import prisma from '../db/prisma';
import { NotFoundError, ConflictError } from '../errors/ApiError';
import { hashPassword, comparePassword } from '../utils/bcrypt'; // NOVO IMPORT

// Interface para o usuário sem a senha (o Prisma já faz isso, mas é bom para tipagem)
interface UserData {
    id: number;
    email: string;
    isAdmin: boolean;
    // ... outros campos que o user pode ter
}

// ----------------------------------------------------------------
// ⚠️ NOVO: Lógica de Cadastro (POST /users)
// ----------------------------------------------------------------
export async function registerUser(email: string, password: string): Promise<UserData> {
    try {
        const hashedPassword = await hashPassword(password); // Hash da senha

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                // O novo usuário é sempre criado como não-admin (isAdmin: false)
            },
            select: { id: true, email: true, isAdmin: true }
        });
        return newUser;
    } catch (error) {
        // P2002: Unique constraint violation (Email duplicado)
        if (error.code === 'P2002') {
            throw new ConflictError('Este e-mail já está cadastrado. Por favor, faça login ou use outro e-mail.');
        }
        throw error;
    }
}

// ----------------------------------------------------------------
// ATUALIZADO: Lógica de Atualização (PUT /users/:id)
// ----------------------------------------------------------------
export async function updateUserDetails(userId: number, email?: string, password?: string): Promise<UserData> {
    const data: any = {};

    if (email) {
        // Verifica se o novo email já existe (excluindo o próprio usuário)
        const existingUser = await prisma.user.findFirst({
            where: {
                email,
                NOT: {
                    id: userId
                }
            }
        });
        if (existingUser) {
            throw new ConflictError('Este e-mail já está sendo utilizado por outro usuário.');
        }
        data.email = email;
    }

    if (password) {
        data.password = await hashPassword(password); // Hash da nova senha
    }

    if (Object.keys(data).length === 0) {
        // Nenhuma atualização solicitada
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, isAdmin: true }
        });
        if (!user) throw new NotFoundError('Usuário não encontrado.');
        return user;
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, email: true, isAdmin: true }
        });
        return updatedUser;
    } catch (error) {
        // P2025: Record not found (Usuário não existe)
        if (error.code === 'P2025') {
            throw new NotFoundError('Não foi possível atualizar. Usuário não encontrado.');
        }
        throw error;
    }
}

// ----------------------------------------------------------------
// OUTRAS FUNÇÕES EXISTENTES (GET /users/:id, etc.)
// MANTIDAS INALTERADAS SE VOCÊ JÁ AS TINHA, mas precisam do 'authenticate' no Controller.
// ----------------------------------------------------------------
export async function getUserById(userId: number): Promise<UserData> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, isAdmin: true }
    });

    if (!user) {
        throw new NotFoundError('Usuário não encontrado.');
    }
    return user;
}