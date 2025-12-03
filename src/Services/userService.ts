import { prisma } from '../db/prisma.ts';
import { hashPassword, comparePassword } from '../utils/bcrypt.ts'; 
import { ConflictError, NotFoundError } from '../errors/ApiError.ts';
import { User, Prisma } from '@prisma/client'; 

// Tipo de retorno para dados de usuário seguros (sem o hash da senha)
type UserSafe = Omit<User, 'password'>; 

// ----------------------------------------------------------------------

/**
 * Lógica de Cadastro (Registro).
 */
export async function createUser(email: string, password: string): Promise<UserSafe> {
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
 * Lógica de Login: Busca o usuário pelo email e verifica a senha.
 */
export async function findUser(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        // Usuário não encontrado
        return null;
    }

    // Compara a senha fornecida com o hash armazenado
    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
        // Senha incorreta
        return null;
    }

    return user;
}

/**
 * Busca o usuário apenas por email (para verificar unicidade no registro).
 */
export async function findUserByEmail(email: string): Promise<UserSafe | null> {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, isAdmin: true },
    });
    
    return user;
}

// ----------------------------------------------------------------------

/**
 * Busca o PRIMEIRO usuário do banco de dados. (Para simulação de perfil logado).
 */
export async function getFirstUser(): Promise<UserSafe | null> {
    const user = await prisma.user.findFirst({
        select: { id: true, email: true, isAdmin: true },
        orderBy: { id: 'asc' }
    });
    return user;
}

/**
 * Busca o usuário por ID (para /users/me e rotas admin).
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
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundError('Seu usuário não foi encontrado.');
        }
        throw error;
    }
}

/**
 * Deleta um usuário.
 */
export async function deleteUser(id: string): Promise<void> {
    const userId = parseInt(id, 10);
    
    if (isNaN(userId)) {
        throw new NotFoundError('ID de usuário inválido.');
    }

    try {
        await prisma.user.delete({
            where: { id: userId },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundError('Usuário não encontrado para exclusão.');
        }
        throw error;
    }
}