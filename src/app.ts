import express, { Express, Request, Response } from "express";
import cors from 'cors'; 
import userRoutes from './Routes/userRoutes'; 
import cardRoutes from './Routes/cardRoutes'; 
import authRoutes from './Routes/authRoutes'; // ⬅️ NOVO IMPORT
import gameRoutes from './Routes/gameRoutes'; // ⬅️ NOVO IMPORT
import errorMiddleware from "./middleware/errorMiddleware";

const app: Express = express();

// CONFIGURAÇÃO DE MIDDLEWARE
app.use(cors()); 
app.use(express.json());

// Rota de teste (Health Check)
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: 'API Online', message: 'Use /users, /cards, /auth ou /game.' });
});

// Anexa os Routers
app.use('/auth', authRoutes); // ⬅️ NOVO: Rotas de Autenticação (Login/AdminKey)
app.use('/users', userRoutes); 
app.use('/cards', cardRoutes); 
app.use('/game', gameRoutes); // ⬅️ NOVO: Rotas do Jogo

// MIDDLEWARE DE TRATAMENTO DE ERROS (DEVE SER O ÚLTIMO app.use)
app.use(errorMiddleware);

export default app;