// src/Services/gameService.ts

import { prisma } from '../db/prisma';
import { NotFoundError, BadRequestError } from '../errors/ApiError';

/**
 * Busca uma carta aleatória para o desafio.
 */
export async function getMysteryCard(): Promise<{ cardId: number, cardImageUrl: string }> {
    // Busca o total de cartas
    const count = await prisma.card.count();
    if (count === 0) {
        throw new NotFoundError('Nenhuma carta cadastrada no banco de dados para iniciar o jogo.');
    }

    // Seleciona um índice aleatório
    const skip = Math.floor(Math.random() * count);
    
    // Busca a carta aleatória (método simples)
    const randomCard = await prisma.card.findFirst({
        take: 1,
        skip: skip,
        select: { id: true, imagem: true },
    });

    if (!randomCard) {
        throw new NotFoundError('Falha ao selecionar carta misteriosa.');
    }

    return { cardId: randomCard.id, cardImageUrl: randomCard.imagem };
}

/**
 * Processa o palpite do jogador.
 */
export async function submitGuess(cardId: number, palpite: { tipo: string, nivel: number, classe: string }) {
    const card = await prisma.card.findUnique({
        where: { id: cardId },
        select: { nome: true, tipo: true, nivel: true, classe: true, imagemRevelada: true }
    });

    if (!card) {
        throw new NotFoundError('A carta que você está tentando adivinhar não existe ou foi excluída.');
    }
    
    // Comparação da lógica principal do jogo
    const results = {
        type: card.tipo === palpite.tipo,
        level: card.nivel === palpite.nivel,
        attribute: card.classe === palpite.classe,
    };

    const allCorrect = results.type && results.level && results.attribute;

    return {
        allCorrect,
        results,
        cardName: allCorrect ? card.nome : null,
        imageUrl: allCorrect ? card.imagemRevelada : null,
    };
}