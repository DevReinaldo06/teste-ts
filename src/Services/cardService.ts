import prisma from '../db/prisma'; 
import { Card, Prisma } from '@prisma/client';

// Tipos de dados de entrada para a tabela Card
interface CardInput {
    imagem: string;
    tipo: string;
    nivel: number; 
    classe: string; 
}

// Tipos de dados de entrada para atualização (todos opcionais)
type CardUpdateData = Partial<CardInput>;

const cardService = {
    // ------------------------------------
    // GET ALL /cards
    // ------------------------------------
    async getAllCards(): Promise<Card[]> {
        return prisma.card.findMany({
            orderBy: { id: 'asc' }
        });
    },

    // ------------------------------------
    // GET BY ID /cards/:id
    // ------------------------------------
    async getCardById(id: number): Promise<Card | null> {
        return prisma.card.findUnique({
            where: { id: id }
        });
    },

    // ------------------------------------
    // POST /cards (Criar Novo Card)
    // ------------------------------------
    async createCard(data: CardInput): Promise<Card> {
        try {
            return await prisma.card.create({ data });
        } catch (error) {
            // Não há campos @unique além do ID no schema Card, 
            // então geralmente apenas relançamos o erro para o Controller
            throw error;
        }
    },

    // ------------------------------------
    // PUT /cards/:id (Atualizar Card)
    // ------------------------------------
    async updateCard(id: number, data: CardUpdateData): Promise<Card> {
        try {
            return await prisma.card.update({
                where: { id: id },
                data: data,
            });
        } catch (error) {
            // Tratamento para Card não encontrado (P2025)
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                 throw new Error("P2025: Card não encontrado.");
            }
            throw error;
        }
    },

    // ------------------------------------
    // DELETE /cards/:id (Deletar Card)
    // ------------------------------------
    async deleteCard(id: number): Promise<Card> {
        try {
            return await prisma.card.delete({
                where: { id: id },
            });
        } catch (error) {
            // Tratamento para Card não encontrado (P2025)
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                 throw new Error("P2025: Card não encontrado.");
            }
            throw error;
        }
    }
};

export default cardService;