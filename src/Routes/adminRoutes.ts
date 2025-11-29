import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/authMiddleware';
import * as adminUserController from '../Controllers/adminUserController';

const router = Router();

// Todas as rotas de administração devem ser autenticadas e restritas a Admins
router.use(authenticate, isAdmin);

// ----------------------------------------------------------------
// CRUD de Usuários para Administrador (Página de Admin > Usuários)
// ----------------------------------------------------------------
// GET /admin/users - Listar todos
router.get('/users', adminUserController.getAllUsers);
// PUT /admin/users/:id - Editar qualquer usuário
router.put('/users/:id', adminUserController.updateUserDetails);
// DELETE /admin/users/:id - Deletar qualquer usuário
router.delete('/users/:id', adminUserController.deleteUser);

// NOTA: As rotas de Card CRUD já estão em cardRoutes.ts,
// mas você pode movê-las aqui se quiser centralizar tudo em /admin/cards

export default router;