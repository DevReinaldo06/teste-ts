// back/src/routes/userRoutes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware'; // Importa o middleware
// Importe suas funções de serviço de usuário: getAllUsers, updateUser

const userRouter = Router();


// Rota Protegida: Listar todos os usuários (APENAS Admin/Autenticado)
userRouter.get('/', authenticate, async (req, res) => {
    // ... lógica para buscar todos os usuários (getAllUsers)
    res.status(200).json(/* users */);
});

// Rota Protegida: Atualizar perfil (APENAS Usuário Autenticado)
userRouter.put('/:id', authenticate, async (req, res) => {
    // ... lógica para atualizar usuário (updateUser)
    res.status(200).json(/* updatedUser */);
});

export default userRouter;