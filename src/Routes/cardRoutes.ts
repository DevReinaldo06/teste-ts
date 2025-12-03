// src/Routes/cardRoutes.ts

import { Router } from 'express';
import * as cardController from '../Controllers/cardController';
import { authenticate, isAdmin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { cardSchema } from '../schemas/cardSchema';

const router = Router();

// Rotas de CRUD Admin para Cards (protegidas por Auth e Admin)
// GET /cards
router.get('/', authenticate, isAdmin, cardController.getAllCards);
// POST /cards
router.post('/', authenticate, isAdmin, validate(cardSchema), cardController.createCard);
// PUT /cards/:id
router.put('/:id', authenticate, isAdmin, validate(cardSchema), cardController.updateCard);
// DELETE /cards/:id
router.delete('/:id', authenticate, isAdmin, cardController.deleteCard);

export default router;