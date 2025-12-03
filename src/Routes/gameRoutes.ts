// src/Routes/gameRoutes.ts

import { Router } from 'express';
import * as gameController from '../Controllers/gameController';
// import { authenticate } from '../middleware/authMiddleware'; // REMOVIDO

const router = Router();

// Endpoint para buscar uma nova carta misteriosa (authenticate já foi aplicado em app.ts)
// GET /mystery-card
router.get('/mystery-card', gameController.getMysteryCard);

// Endpoint para submeter o palpite
// POST /guess
router.post('/guess', gameController.submitGuess);

export default router;