// src/Services/cardService.ts

// 💡 CORREÇÃO 1: Adicionando a extensão .js para resolução de módulos ESM
import { prisma } from '../db/prisma'; 
import { Card, Prisma } from '@prisma/client';
// 💡 CORREÇÃO 2: Adicionando a extensão .js para resolução de módulos ESM
import { NotFoundError } from '../errors/ApiError.ts'; 

// Tipos de dados de entrada para a tabela Card
interface CardInput {
    nome: string;
    imagem: string;
    imagemRevelada: string;
    tipo: string;
    nivel: number; 
    classe: string; 
}

// Tipos de dados de entrada para atualização (todos opcionais)
type CardUpdateData = Partial<CardInput>;

// ------------------------------------
// 1. GET ALL /cards
// ------------------------------------
export async function getAllCards(): Promise<Card[]> {
    return prisma.card.findMany({
        orderBy: { id: 'asc' }
    });
}

// ------------------------------------
// 2. GET BY ID /cards/:id
// ------------------------------------
export async function getCardById(id: number): Promise<Card | null> {
    return prisma.card.findUnique({
        where: { id: id }
    });
}

// ------------------------------------
// 3. POST /cards (Criar Novo Card)
// ------------------------------------
export async function createCard(data: CardInput): Promise<Card> {
    // O bloco try/catch aqui é desnecessário se você apenas for re-throw o erro.
    // O erro será tratado pelo middleware de erro no Express.
    return await prisma.card.create({ data });
}

// ------------------------------------
// 4. PUT /cards/:id (Atualizar Card)
// ------------------------------------
export async function updateCard(id: number, data: CardUpdateData): Promise<Card> {
    try {
        return await prisma.card.update({
            where: { id: id },
            data: data,
        });
    } catch (error) {
        // Tratamento para Card não encontrado (P2025)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundError("Card não encontrado para atualização.");
        }
        throw error;
    }
}

// ------------------------------------
// 5. DELETE /cards/:id (Deletar Card)
// ------------------------------------
export async function deleteCard(id: number): Promise<Card> {
    try {
        return await prisma.card.delete({
            where: { id: id },
        });
    } catch (error) {
        // Tratamento para Card não encontrado (P2025)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundError("Card não encontrado para exclusão.");
        }
        throw error;
    }
}