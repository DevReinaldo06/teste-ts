import { Router } from 'express';
import * as gameController from '../Controllers/gameController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Endpoint para buscar uma nova carta misteriosa
// Requer autenticação, pois só usuários logados jogam.
// Front-end: GET /game/mystery-card
router.get('/mystery-card', authenticate, gameController.getMysteryCard);

// Endpoint para submeter o palpite
// Requer autenticação
// Front-end: POST /game/guess
router.post('/guess', authenticate, gameController.submitGuess);

export default router;