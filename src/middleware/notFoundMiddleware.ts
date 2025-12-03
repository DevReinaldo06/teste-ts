import express from 'express';
import cors from 'cors';

import authRouter from '../Routes/authRoutes.ts'; 
import cardRouter from '../Routes/cardRoutes.ts'; 
import gameRouter from '../Routes/gameRoutes.ts';
import userRouter from '../Routes/userRoutes.ts'; 

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



// Rotas que exigem usuário logado
app.use('/game', gameRouter);



// Rotas de tratamento de erro (Se você as criar, coloque-as aqui)
// app.use(errorMiddleware); // Exemplo: Middleware de tratamento de erros

export default app;