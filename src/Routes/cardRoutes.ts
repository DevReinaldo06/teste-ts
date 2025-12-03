// src/Routes/cardRoutes.ts

import { Router } from 'express';
// Importa o controlador de cards, que contém a lógica de negócios
// 💡 CORREÇÃO: Adicionando a extensão .js no final
import * as cardController from '../controllers/cardController.ts'; 

const router = Router();

// ----------------------------------------------------------------------
// Rotas de Cards - CRUD Completo (AGORA TOTALMENTE LIVRES DE AUTENTICAÇÃO)
// ----------------------------------------------------------------------

/**
 * @route GET /card
 * @desc Lista todos os cards (Necessário para a lógica do jogo).
 * Acesso: Livre
 */
router.get('/', cardController.getCards);

/**
 * @route POST /card
 * @desc Cria um novo card.
 * Acesso: Livre (para facilitar o seed ou upload de dados pelo cliente admin)
 */
router.post('/', cardController.createCard);

/**
 * @route PUT /card/:id
 * @desc Atualiza um card existente.
 * Acesso: Livre
 */
router.put('/:id', cardController.updateCard);

/**
 * @route DELETE /card/:id
 * @desc Deleta um card existente.
 * Acesso: Livre
 */
router.delete('/:id', cardController.deleteCard);

export default router;