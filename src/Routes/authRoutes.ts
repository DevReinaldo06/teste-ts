import { Router } from 'express';
import * as userController from '../Controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// ⚠️ NOVO: Rota para Cadastro de Usuário (POST /users)
// Front-end: POST /users (ou via /auth/register que chama a lógica interna)
router.post('/', userController.register);

// Rota para o perfil (GET /users/me) - Requer autenticação
// Front-end: GET /users/:id
router.get('/me', authenticate, userController.getProfile);

// Rota para alterar o perfil (PUT /users/me) - Requer autenticação
// Front-end: PUT /users/:id
router.put('/me', authenticate, userController.updateProfile);

// Rota de exclusão (DELETE /users/:id) - Se for permitir a auto-exclusão
// router.delete('/me', authenticate, userController.deleteUser); 

export default router;