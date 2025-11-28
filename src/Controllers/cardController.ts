// src/Controllers/cardController.ts

import { Request, Response, NextFunction } from 'express';
import * as cardService from '../Services/cardService';
import { BadRequestError, NotFoundError } from '../errors/ApiError';

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
// Requer Admin para ser usado na rota /cards
export async function getAllCards(req: Request, res: Response, next: NextFunction) {
    try {
        const cards = await cardService.getAllCards(); // Função que criamos no Service
        return res.status(200).json(cards);
    } catch (error) {
        next(error);
    }
}

// ----------------------------------------------------------------
// 2. POST /cards (Criar novo card)
// ----------------------------------------------------------------
// Requer Admin
export async function createCard(req: Request, res: Response, next: NextFunction) {
    try {
        const { nome, imagem, imagemRevelada, tipo, nivel, classe } = req.body as CardInput;

        // Verifica campos obrigatórios para criação
        if (!nome || !imagem || !imagemRevelada || !tipo || nivel === undefined || !classe) {
            throw new BadRequestError('Todos os campos (nome, imagem, imagemRevelada, tipo, nivel, classe) são obrigatórios para criar um card.');
        }

        const newCard = await cardService.createCard({ 
            nome, 
            imagem, 
            imagemRevelada, 
            tipo, 
            nivel: Number(nivel), // Garante que o nível é um número
            classe 
        });
        
        return res.status(201).json(newCard);

    } catch (error) {
        next(error);
    }
}

// ----------------------------------------------------------------
// 3. PUT /cards/:id (Atualizar card)
// ----------------------------------------------------------------
// Requer Admin
export async function updateCard(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        const updateData: CardInput = req.body;

        if (isNaN(id)) {
            throw new BadRequestError('O ID do card deve ser um número válido.');
        }
        
        // Se nivel for fornecido, garanta que é um número
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
// Requer Admin
export async function deleteCard(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            throw new BadRequestError('O ID do card deve ser um número válido.');
        }

        await cardService.deleteCard(id); // Função que criamos no Service
        
        return res.status(204).send(); // 204 No Content

    } catch (error) {
        next(error);
    }
}