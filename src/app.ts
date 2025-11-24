import express, { Express, Request, Response } from "express";
import cors from 'cors'; 
import userRoutes from './Routes/userRoutes'; 
import cardRoutes from './Routes/cardRoutes'; // ⬅️ IMPORT NECESSÁRIO!

const app: Express = express();

// CONFIGURAÇÃO DE MIDDLEWARE
app.use(cors()); 
app.use(express.json());

// Rota de teste (Health Check)
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: 'API Online', message: 'Use /users ou /cards para os CRUDs.' });
});

// Anexa o Router de usuários
app.use('/users', userRoutes); 

// ⬅️ LINHA NECESSÁRIA PARA HABILITAR O CRUD DE CARDS!
app.use('/cards', cardRoutes); 

export default app;