// src/Routes/authRoutes.ts

import { Router } from 'express';
import * as authController from '../Controllers/authController';
import { validate } from '../middleware/validationMiddleware';
import { loginSchema } from '../schemas/userSchema';

const router = Router();

// Rota para login de usuários normais e admins
// POST /auth/login
router.post('/login', validate(loginSchema), authController.login);

// Rota opcional para checagem da chave de admin
// POST /auth/admin-key
router.post('/admin-key', authController.adminLogin);

export default router;