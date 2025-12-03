import { Router } from 'express';
// O nome do arquivo DEVE incluir .ts para o 'NodeNext'
import cardRouter from './cardRoutes.ts';
import userRouter from './userRoutes.ts';
import authRouter from './authRoutes.ts'; 

const router = Router();

// 1. Rotas de Autenticação (Apenas funções de usuário)
router.use('/auth', authRouter);

// 2. Rotas de Cards (CRUD de Cards, agora totalmente público)
router.use('/cards', cardRouter);

// 3. Rotas de Usuários (Busca e Atualização de Usuários, agora totalmente público)
router.use('/users', userRouter);

export default router;