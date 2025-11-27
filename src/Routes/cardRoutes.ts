import { Router } from 'express';
import * as cardController from '../Controllers/cardController';
import { authenticate, isAdmin } from '../middleware/authMiddleware'; // NOVO IMPORT

const router = Router();

// GET /cards - Listar todos (Admin)
// Front-end Admin: GET /cards
router.get('/', authenticate, isAdmin, cardController.getAllCards);

// POST /cards - Criar novo card (Admin)
// Front-end Admin: POST /cards
router.post('/', authenticate, isAdmin, cardController.createCard);

// PUT /cards/:id - Editar card (Admin)
// Front-end Admin: PUT /cards/:id
router.put('/:id', authenticate, isAdmin, cardController.updateCard);

// DELETE /cards/:id - Excluir card (Admin)
// Front-end Admin: DELETE /cards/:id
router.delete('/:id', authenticate, isAdmin, cardController.deleteCard);

export default router;