// Conteúdo anterior + adição do middleware 'isAdmin' para as rotas de Admin

import { Request, Response, NextFunction } from 'express';
import * as cardService from '../Services/cardService';
import { BadRequestError, NotFoundError } from '../errors/ApiError';

// ⚠️ Se o seu CardController original tiver estes métodos, use esta estrutura:

// POST /cards
export async function createCard(req: Request, res: Response, next: NextFunction) {
    // ... lógica de criação (com novas colunas 'imagemRevelada' se necessário)
    try {
        const { nome, imagem, imagemRevelada, tipo, nivel, classe } = req.body; // NOVO: imagemRevelada

        if (!nome || !imagem || !imagemRevelada || !tipo || !nivel || !classe) {
            throw new BadRequestError('Todos os campos (nome, imagem, imagemRevelada, tipo, nivel, classe) são obrigatórios.');
        }

        const newCard = await cardService.createCard({ nome, imagem, imagemRevelada, tipo, nivel, classe });
        
        return res.status(201).json(newCard);

    } catch (error) {
        next(error);
    }
}

// GET /cards
export async function getAllCards(req: Request, res: Response, next: NextFunction) {
    // ... lógica de listagem (não precisa de isAdmin aqui se a rota GET for pública, mas Admin só lista)
    try {
        const cards = await cardService.getAllCards();
        return res.status(200).json(cards);
    } catch (error) {
        next(error);
    }
}

// PUT /cards/:id
export async function updateCard(req: Request, res: Response, next: NextFunction) {
    // ... lógica de atualização
    try {
        const id = parseInt(req.params.id);
        const { nome, imagem, imagemRevelada, tipo, nivel, classe } = req.body; // NOVO: imagemRevelada
        
        if (isNaN(id)) {
            throw new BadRequestError('O ID da carta deve ser um número válido.');
        }

        if (!nome || !imagem || !imagemRevelada || !tipo || !nivel || !classe) {
            throw new BadRequestError('Todos os campos são obrigatórios para a atualização.');
        }

        const updatedCard = await cardService.updateCard(id, { nome, imagem, imagemRevelada, tipo, nivel, classe });
        
        return res.status(200).json(updatedCard);

    } catch (error) {
        next(error);
    }
}

// DELETE /cards/:id
export async function deleteCard(req: Request, res: Response, next: NextFunction) {
    // ... lógica de exclusão
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            throw new BadRequestError('O ID da carta deve ser um número válido.');
        }

        await cardService.deleteCard(id);
        
        return res.status(204).send(); // 204 No Content

    } catch (error) {
        next(error);
    }
}