import { Router } from 'express';
import * as authController from '../Controllers/authController';
import { validate } from '../middleware/validationMiddleware'; // NOVO IMPORT
import { loginSchema } from '../schemas/userSchema'; // NOVO IMPORT

const router = Router();

// Rota para login de usuários normais e admins
// Front-end: POST /auth/login
router.post('/login', validate(loginSchema), authController.login); // ⬅️ Adiciona Validação

// Rota opcional para checagem da chave de admin
router.post('/admin-key', authController.adminLogin);

export default router;