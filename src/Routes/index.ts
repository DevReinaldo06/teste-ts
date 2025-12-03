// back/src/routes/index.ts
import { Router } from 'express';
import cardRouter from './cardRoutes';
import userRouter from './userRoutes';
import authRouter from './authRoutes'; 
import { authenticate } from '../middleware/authMiddleware'; // Importa o middleware

const router = Router();

// 1. Rotas de Autenticação
// Estas rotas (login, register, admin-key) NUNCA devem ser protegidas.
router.use('/auth', authRouter);

// 2. Rotas de Cards
// A rota GET /cards deve ser pública para carregar o jogo.
// As rotas POST, PUT, DELETE /cards/:id DEVEM ser protegidas.
// Se você está usando um roteador separado (cardRoutes.ts), aplicamos a proteção lá.
router.use('/cards', cardRouter);

// 3. Rotas de Usuários
// A rota GET /users (usada pelo Admin) deve ser protegida.
// A rota PUT /users/:id (atualização de perfil) deve ser protegida.
// Novamente, se está usando um roteador separado (userRoutes.ts), aplicamos a proteção lá.
router.use('/users', userRouter); // O middleware deve ser aplicado dentro de userRoutes.ts

export default router;