import { Router } from 'express';
import * as gameController from '../Controllers/gameController.ts';
// authenticate removido

const router = Router();

// Endpoint para buscar uma nova carta misteriosa (totalmente livre)
// GET /mystery-card
router.get('/mystery-card', gameController.getMysteryCard);

// Endpoint para submeter o palpite (totalmente livre)
// POST /guess
router.post('/guess', gameController.submitGuess);

export default router;