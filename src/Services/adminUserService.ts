import prisma from '../db/prisma';
import { hashPassword } from '../utils/bcrypt';
// 🚨 CORREÇÃO: Adicionada a BadRequestError à lista de imports
import { NotFoundError, ConflictError, BadRequestError } from '../errors/ApiError'; 

// ----------------------------------------------------------------
// Admin: Listar Todos os Usuários (GET /admin/users)
// ----------------------------------------------------------------
export async function getAllUsersForAdmin() {
    // Não retorna a senha, mas retorna o email e o status isAdmin
    const users = await prisma.user.findMany({
        select: { id: true, email: true, isAdmin: true }
    });
    return users;
}

// ----------------------------------------------------------------
// Admin: Atualizar Usuário Específico (PUT /admin/users/:id)
// ----------------------------------------------------------------
export async function updateAnyUser(userId: number, email?: string, password?: string, isAdmin?: boolean) {
    const data: any = {};

    if (email) {
        // Verifica se o novo email já existe para outro usuário
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
    
    // Admin pode alterar o status de Admin (opcional)
    if (isAdmin !== undefined) {
        data.isAdmin = isAdmin;
    }

    if (Object.keys(data).length === 0) {
        throw new BadRequestError('Nenhum dado fornecido para atualização.');
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, email: true, isAdmin: true }
        });
        return updatedUser;
    } catch (error) {
        // ⬅️ CORREÇÃO: Verificação de tipo para 'error'
        if (typeof error === 'object' && error !== null && 'code' in error) {
            if (error.code === 'P2025') {
                throw new NotFoundError('Usuário não encontrado.');
            }
        }
        throw error;
    }
}

// ----------------------------------------------------------------
// Admin: Deletar Usuário (DELETE /admin/users/:id)
// ----------------------------------------------------------------
export async function deleteUser(userId: number) {
    try {
        await prisma.user.delete({
            where: { id: userId }
        });
        // Retorna implicitamente sucesso (o Controller enviará 204)
    } catch (error) {
        // ⬅️ CORREÇÃO: Verificação de tipo para 'error'
        if (typeof error === 'object' && error !== null && 'code' in error) {
            if (error.code === 'P2025') {
                throw new NotFoundError('Usuário não encontrado.');
            }
        }
        throw error;
    }
}