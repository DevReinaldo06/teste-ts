// src/Routes/adminRoutes.ts

import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/authMiddleware';
import * as adminUserController from '../Controllers/adminUserController';

const router = Router();

// Todas as rotas de administração devem ser autenticadas e restritas a Admins
router.use(authenticate, isAdmin);

// CRUD de Usuários para Administrador
// GET /admin/users - Listar todos
router.get('/users', adminUserController.getAllUsers);
// PUT /admin/users/:id - Editar qualquer usuário
router.put('/users/:id', adminUserController.updateUserDetails);
// DELETE /admin/users/:id - Deletar qualquer usuário
router.delete('/users/:id', adminUserController.deleteUser);

export default router;