import { Router } from 'express';
import * as cardController from '../Controllers/cardController';
import { authenticate, isAdmin } from '../middleware/authMiddleware'; // Ajuste de diretório
import { validate } from '../middleware/validationMiddleware'; // NOVO IMPORT
import { cardSchema } from '../schemas/cardSchema'; // NOVO IMPORT

const router = Router();

// Rotas de CRUD Admin (protegidas por Auth e Admin)
router.get('/', authenticate, isAdmin, cardController.getAllCards);
router.post('/', authenticate, isAdmin, validate(cardSchema), cardController.createCard); // ⬅️ Adiciona Validação
router.put('/:id', authenticate, isAdmin, validate(cardSchema), cardController.updateCard); // ⬅️ Adiciona Validação
router.delete('/:id', authenticate, isAdmin, cardController.deleteCard);

export default router;