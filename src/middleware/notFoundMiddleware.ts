import express from 'express';
import cors from 'cors';

import authRouter from '../Routes/authRoutes'; 
import adminRouter from '../Routes/adminRoutes'; 
import cardRouter from '../Routes/cardRoutes'; 
import gameRouter from '../Routes/gameRoutes';
import userRouter from '../Routes/userRoutes'; 

import { authenticate, isAdmin } from './authMiddleware'; 

const app = express();

// Middlewares Globais
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// --- 1. ZONA LIVRE (Rotas de Autenticação e Registro) ---
// Estas rotas não requerem JWT e devem vir antes do 'authenticate'

// /auth/* : (Login, Register, AdminKey)
app.use('/auth', authRouter); 

// /users : (Contém POST /users para registro, que é livre)
// Montamos o userRouter aqui. A rota POST /users é livre.
// As rotas GET/PUT /users/me são protegidas INTERNAMENTE no userRoutes.ts.
app.use('/users', userRouter); 

// --- 2. ZONA PROTEGIDA (Requer Autenticação JWT) ---

// Rotas que exigem um token de acesso válido.
// Toda rota abaixo será verificada pelo 'authenticate'
app.use(authenticate); 

// Rotas que exigem usuário logado
app.use('/game', gameRouter);

// Rotas que exigem ADMIN logado 
// O 'authenticate' já foi aplicado acima, só precisamos do 'isAdmin'
app.use('/admin', isAdmin, adminRouter); 
app.use('/cards', isAdmin, cardRouter); 


// Rotas de tratamento de erro (Se você as criar, coloque-as aqui)
// app.use(errorMiddleware); // Exemplo: Middleware de tratamento de erros

export default app;