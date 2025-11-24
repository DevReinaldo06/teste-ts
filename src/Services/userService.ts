import prisma from '../db/prisma'; 
import { User, Prisma } from '@prisma/client';

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
                // Lança uma mensagem genérica que o Controller interpretará
                throw new Error("P2002: Email já cadastrado."); 
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
                throw new Error("P2002: Email já em uso por outro usuário.");
            }
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                 throw new Error("P2025: Usuário não encontrado.");
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
                 throw new Error("P2025: Usuário não encontrado.");
            }
            throw error;
        }
    }
};

export default userService;