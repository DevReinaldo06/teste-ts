import prisma from '../db/prisma'; 
import { Card, Prisma } from '@prisma/client';
import { NotFoundError } from '../errors/ApiError';

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
// ✅ CORREÇÃO: Exporta a função individualmente
export async function getAllCards(): Promise<Card[]> {
    return prisma.card.findMany({
        orderBy: { id: 'asc' }
    });
}

// ------------------------------------
// 2. GET BY ID /cards/:id
// ------------------------------------
// ✅ CORREÇÃO: Exporta a função individualmente
export async function getCardById(id: number): Promise<Card | null> {
    return prisma.card.findUnique({
        where: { id: id }
    });
}

// ------------------------------------
// 3. POST /cards (Criar Novo Card)
// ------------------------------------
// ✅ CORREÇÃO: Exporta a função individualmente
export async function createCard(data: CardInput): Promise<Card> {
    try {
        // Se a coluna 'nome' não estava na interface CardInput, ela deve ser adicionada
        // ou a chamada ao Service deve ser ajustada no Controller.
        return await prisma.card.create({ data });
    } catch (error) {
        throw error;
    }
}

// ------------------------------------
// 4. PUT /cards/:id (Atualizar Card)
// ------------------------------------
// ✅ CORREÇÃO: Exporta a função individualmente
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
// ✅ CORREÇÃO: Exporta a função individualmente
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

// ⚠️ NOTA IMPORTANTE: Removido 'export default cardService'
// Agora, as funções são importadas via exportação nomeada, como esperado pelo seu Controller.