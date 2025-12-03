// src/Controllers/cardController.ts

import { Request, Response, NextFunction } from 'express';
import * as cardService from '../Services/cardService';
import { BadRequestError } from '../errors/ApiError';

// Interface para os dados que o corpo da requisição de criação/atualização pode ter
interface CardInput {
    nome?: string;
    imagem?: string;
    imagemRevelada?: string;
    tipo?: string;
    nivel?: number;
    classe?: string;
}

// ----------------------------------------------------------------
// 1. GET /cards (Listar todos os cards)
// ----------------------------------------------------------------
export async function getAllCards(req: Request, res: Response, next: NextFunction) {
    try {
        const cards = await cardService.getAllCards(); 
        return res.status(200).json(cards);
    } catch (error) {
        next(error);
    }
}

// ----------------------------------------------------------------
// 2. POST /cards (Criar novo card)
// ----------------------------------------------------------------
export async function createCard(req: Request, res: Response, next: NextFunction) {
    try {
        // Zod garante a presença e o tipo dos campos
        const { nome, imagem, imagemRevelada, tipo, nivel, classe } = req.body as CardInput;

        const newCard = await cardService.createCard({ 
            nome: nome!, 
            imagem: imagem!, 
            imagemRevelada: imagemRevelada!, 
            tipo: tipo!, 
            nivel: Number(nivel),
            classe: classe! 
        });
        
        return res.status(201).json(newCard);

    } catch (error) {
        next(error);
    }
}

// ----------------------------------------------------------------
// 3. PUT /cards/:id (Atualizar card)
// ----------------------------------------------------------------
export async function updateCard(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        const updateData: CardInput = req.body;

        if (isNaN(id)) {
            throw new BadRequestError('O ID do card deve ser um número válido.');
        }
        
        if (updateData.nivel !== undefined) {
             updateData.nivel = Number(updateData.nivel);
        }

        const updatedCard = await cardService.updateCard(id, updateData);
        
        return res.status(200).json(updatedCard);

    } catch (error) {
        next(error);
    }
}

// ----------------------------------------------------------------
// 4. DELETE /cards/:id (Excluir card)
// ----------------------------------------------------------------
export async function deleteCard(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            throw new BadRequestError('O ID do card deve ser um número válido.');
        }

        await cardService.deleteCard(id); 
        
        return res.status(204).send();

    } catch (error) {
        next(error);
    }
}