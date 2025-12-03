import { Router } from 'express';
// isAdmin e authenticate foram removidos para tornar as rotas livres
import * as adminUserController from '../Controllers/adminUserController.ts';

const router = Router();

// Todas as rotas de administração agora são totalmente públicas.

// CRUD de Usuários para Administrador
// GET /users - Listar todos
router.get('/users', adminUserController.getAllUsers);
// PUT /users/:id - Editar qualquer usuário
router.put('/users/:id', adminUserController.updateUserDetails);
// DELETE /users/:id - Deletar qualquer usuário
router.delete('/users/:id', adminUserController.deleteUser);

export default router;