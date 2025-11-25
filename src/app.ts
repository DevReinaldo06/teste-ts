import express, { Express, Request, Response } from "express";
import cors from 'cors'; 
import userRoutes from './Routes/userRoutes'; 
import cardRoutes from './Routes/cardRoutes'; 
import errorMiddleware from "./middleware/errorMiddleware"; // ⬅️ NOVO IMPORT

const app: Express = express();

// CONFIGURAÇÃO DE MIDDLEWARE
app.use(cors()); 
app.use(express.json());

// Rota de teste (Health Check)
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: 'API Online', message: 'Use /users ou /cards para os CRUDs.' });
});

// Anexa os Routers
app.use('/users', userRoutes); 
app.use('/cards', cardRoutes); 

// ⬅️ MIDDLEWARE DE TRATAMENTO DE ERROS (DEVE SER O ÚLTIMO app.use)
app.use(errorMiddleware);

export default app;