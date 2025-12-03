// src/Controllers/gameController.ts

import { Request, Response, NextFunction } from 'express';
import * as gameService from '../Services/gameService';
import { BadRequestError } from '../errors/ApiError';

/**
 * Endpoint para obter uma carta aleatória (GET /game/mystery-card)
 */
export async function getMysteryCard(req: Request, res: Response, next: NextFunction) {
    try {
        const card = await gameService.getMysteryCard();
        
        return res.status(200).json(card);
    } catch (error) {
        next(error);
    }
}

/**
 * Endpoint para submeter um palpite (POST /game/guess)
 */
export async function submitGuess(req: Request, res: Response, next: NextFunction) {
    try {
        const { cardId, tipo, nivel, classe } = req.body;

        if (!cardId || !tipo || !nivel || !classe) {
            throw new BadRequestError('Os campos cardId, tipo, nivel e classe são obrigatórios para o palpite.');
        }

        const nivelNum = parseInt(nivel);
        if (isNaN(nivelNum) || nivelNum < 1 || nivelNum > 12) {
            throw new BadRequestError('O nível deve ser um número entre 1 e 12.');
        }

        const results = await gameService.submitGuess(cardId, { tipo, nivel: nivelNum, classe });

        return res.status(200).json(results);
    } catch (error) {
        next(error);
    }
}