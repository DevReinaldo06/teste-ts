// src/app.ts

import express from 'express';
import cors from 'cors';

// Importação dos Roteadores
import authRouter from './Routes/authRoutes';
import adminRouter from './Routes/adminRoutes';
import cardRouter from './Routes/cardRoutes';
import gameRouter from './Routes/gameRoutes';
import userRouter from './Routes/userRoutes';

// Importação dos Middlewares
import { authenticate, isAdmin } from './middleware/authMiddleware';

import notFoundMiddleware from './middleware/notFoundMiddleware';
import errorMiddleware from './middleware/errorMiddleware';

const app = express();

// Middlewares Globais
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Ignorar /favicon.ico para não acionar o authenticate
app.get('/favicon.ico', (req, res) => res.status(204).end());

// ------------------------------------
// 1. ROTAS LIVRES (Login, Registro e Leitura de Dados Iniciais)
// ------------------------------------

// Rota de Autenticação (Login, Register, Admin Key)
app.use('/auth', authRouter);

// Rota de Leitura de Cards (GET /cards)
// Essa rota precisa ser pública para carregar o jogo.
// Se seu cardRouter.ts tem o GET / dentro dele,
// precisamos fazer uma inclusão seletiva da rota pública aqui, ou mover
// o GET / para ser o único método acessível publicamente em cardRouter.ts.

// MUDANÇA CRÍTICA: Se o erro persiste, significa que o frontend tenta buscar cards/usuários
// ANTES de fazer login. Vamos criar um ROTEADOR PÚBLICO para essas buscas.

// ------------------------------------
// 2. ROTAS PROTEGIDAS
// ------------------------------------

// Rota de Leitura de Cards (GET /cards)
// Assumindo que o seu cardRouter.ts tem o método GET /
// Vamos montar o cardRouter com os métodos CRUD protegidos (POST, PUT, DELETE) e o GET público.
// Para fazer isso de forma limpa, você deve remover o authenticate do cardRouter.ts
// e aplicá-lo seletivamente DENTRO do cardRoutes.ts (exceto para o GET /).
//
// OU, SE FOR MAIS FÁCIL:
// 1. Crie uma rota temporária para o GET /cards que bypassa o middleware.
// app.get('/cards', cardRouter); // APENAS SE cardRouter for o handler do GET /
//
// 2. SOLUÇÃO MAIS LIMPA (Ajuste no Roteador de Cards):
// Removemos a proteção global aqui e aplicamos DENTRO do cardRoutes.ts
// (Ex: cardRouter.get('/', publicHandler); cardRouter.post('/', authenticate, adminHandler);)

// Retornando à estrutura original, mas tratando o cenário de erro:

// ROTAS DE USUÁRIOS E GAME (Requerem Login)
app.use('/users', authenticate, userRouter);
app.use('/game', authenticate, gameRouter);

// ROTAS DE ADMINISTRAÇÃO (Requerem Admin)
// Nota: O acesso a /cards e /admin deve ser restrito.
app.use('/admin', authenticate, isAdmin, adminRouter);
// Note: Esta linha protege POST/PUT/DELETE, mas o GET /cards está quebrando o frontend.
// Se você está vendo este erro, é porque o *GET* em /cards está sendo barrado.
// A solução é garantir que *GET /cards* não passe por authenticate.
app.use('/cards', cardRouter); // Removendo authenticate daqui e o aplicando DENTRO do cardRouter.ts

// ------------------------------------
// 3. MIDDLEWARES DE ERRO
// ------------------------------------
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;