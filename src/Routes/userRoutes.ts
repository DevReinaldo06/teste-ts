import { Router } from 'express';
import * as userController from '../Controllers/userController';
import { authenticate } from '../middleware/authMiddleware'; // Ajuste de diretório
import { validate } from '../middleware/validationMiddleware'; // NOVO IMPORT
import { registerSchema, updateProfileSchema } from '../schemas/userSchema'; // NOVO IMPORT

const router = Router();

// POST /users - Cadastro de Usuário
router.post('/', validate(registerSchema), userController.register); // ⬅️ Adiciona Validação

// Rota para o perfil (GET /users/me) - Requer autenticação
router.get('/me', authenticate, userController.getProfile);

// Rota para alterar o perfil (PUT /users/me) - Requer autenticação
router.put('/me', authenticate, validate(updateProfileSchema), userController.updateProfile); // ⬅️ Adiciona Validação

export default router;