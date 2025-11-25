import prisma from '../db/prisma'; 
import { User, Prisma } from '@prisma/client';
import { ConflictError, NotFoundError } from '../errors/ApiError'; // ⬅️ IMPORTANTE!

// Tipos de dados de entrada
type UserCreateData = { nome: string, idade: number, email: string };
type UserUpdateData = Partial<UserCreateData>;

const userService = {
    // GET ALL
    async getAllUsers(): Promise<User[]> {
        return prisma.user.findMany({
            orderBy: { id: 'asc' }
        });
    },

    // GET BY ID
    async getUserById(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id: id }
        });
    },

    // POST
    async createUser(data: UserCreateData): Promise<User> {
        try {
            return await prisma.user.create({ data });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                // Lança o erro de conflito
                throw new ConflictError("Email já cadastrado. Por favor, use outro email."); 
            }
            throw error;
        }
    },

    // PUT
    async updateUser(id: number, data: UserUpdateData): Promise<User> {
        try {
            return await prisma.user.update({
                where: { id: id },
                data: data,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictError("O email fornecido já está em uso por outro usuário.");
            }
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                // Lança o erro de não encontrado
                throw new NotFoundError("Usuário não encontrado para atualização.");
            }
            throw error;
        }
    },

    // DELETE
    async deleteUser(id: number): Promise<User> {
        try {
            return await prisma.user.delete({
                where: { id: id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                // Lança o erro de não encontrado
                throw new NotFoundError("Usuário não encontrado para exclusão.");
            }
            throw error;
        }
    }
};

export default userService;