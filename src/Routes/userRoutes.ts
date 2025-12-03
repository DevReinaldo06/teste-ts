// src/Routes/userRoutes.ts

import { Router } from 'express';
import * as userController from '../Controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { registerSchema, updateProfileSchema } from '../schemas/userSchema';

const router = Router();

// POST /users - Cadastro de Usuário
router.post('/', validate(registerSchema), userController.register);

// Rota para o perfil (GET /users/me) - Requer autenticação
router.get('/me', authenticate, userController.getProfile);

// Rota para alterar o perfil (PUT /users/me) - Requer autenticação
router.put('/me', authenticate, validate(updateProfileSchema), userController.updateProfile);

export default router;