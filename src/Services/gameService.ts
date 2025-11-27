import prisma from '../db/prisma';
import { NotFoundError, BadRequestError } from '../errors/ApiError';

/**
 * Busca uma carta aleatória para o desafio.
 * @returns A ID e a URL da imagem da carta aleatória.
 */
export async function getMysteryCard(): Promise<{ cardId: number, cardImageUrl: string }> {
    // ⚠️ ATENÇÃO: A busca aleatória no Prisma pode ser lenta com muitos registros.
    // Uma solução mais eficiente usaria SQL RAW, mas aqui usamos o método mais simples.
    
    const count = await prisma.card.count();
    if (count === 0) {
        throw new NotFoundError('Nenhuma carta cadastrada no banco de dados para iniciar o jogo.');
    }

    const skip = Math.floor(Math.random() * count);
    
    const randomCard = await prisma.card.findFirst({
        take: 1,
        skip: skip,
        select: { id: true, imagem: true },
    });

    if (!randomCard) {
        // Isso só deve acontecer se houver um erro de concorrência ou lógica.
        throw new NotFoundError('Falha ao selecionar carta misteriosa.');
    }

    return { cardId: randomCard.id, cardImageUrl: randomCard.imagem };
}

/**
 * Processa o palpite do jogador.
 * @param cardId ID da carta que está sendo adivinhada.
 * @param palpite Objeto com o palpite do jogador.
 * @returns Resultados da comparação e, se correto, detalhes da carta.
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