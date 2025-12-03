// src/Routes/adminRoutes.ts

import { Router } from 'express';
import { isAdmin } from '../middleware/authMiddleware'; // authenticate foi removido
import * as adminUserController from '../Controllers/adminUserController';

const router = Router();

// Todas as rotas de administração devem ser restritas a Admins (authenticate já foi aplicado em app.ts)
router.use(isAdmin); // Apenas isAdmin é necessário aqui

// CRUD de Usuários para Administrador
// GET /users - Listar todos
router.get('/users', adminUserController.getAllUsers);
// PUT /users/:id - Editar qualquer usuário
router.put('/users/:id', adminUserController.updateUserDetails);
// DELETE /users/:id - Deletar qualquer usuário
router.delete('/users/:id', adminUserController.deleteUser);

export default router;