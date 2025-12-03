// src/Controllers/cardController.ts

import { Request, Response, NextFunction } from 'express';
// 💡 CORREÇÃO: Adicionando a extensão .js para resolução de módulos ESM
import * as cardService from '../Services/cardService.ts';
// 💡 CORREÇÃO ADICIONAL: Certifique-se de que todas as importações locais usam .js
import { BadRequestError } from '../errors/ApiError.ts'; 

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
export async function getCards(req: Request, res: Response, next: NextFunction) {
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
        // Zod garante a presença e o tipo dos campos (assumindo que o middleware Zod está ativo)
        const { nome, imagem, imagemRevelada, tipo, nivel, classe } = req.body as CardInput;

        // Validação básica de presença para evitar problemas de tipo no serviço
        if (!nome || !imagem || !imagemRevelada || !tipo || nivel === undefined || !classe) {
             throw new BadRequestError('Todos os campos (nome, imagem, imagemRevelada, tipo, nivel, classe) são obrigatórios.');
        }

        const newCard = await cardService.createCard({ 
            nome: nome!, 
            imagem: imagem!, 
            imagemRevelada: imagemRevelada!, 
            tipo: tipo!, 
            // O serviço deve tratar o Number(nivel) se o body-parser não fizer a conversão
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
        
        // Garante que se o nível for enviado, ele seja um número
        if (updateData.nivel !== undefined) {
            updateData.nivel = Number(updateData.nivel);
            if (isNaN(updateData.nivel)) {
                 throw new BadRequestError('O campo nivel deve ser um número válido.');
            }
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