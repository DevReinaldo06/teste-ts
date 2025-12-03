// src/app.ts

import express, { Express, Request, Response } from "express";
import cors from 'cors'; 
import userRoutes from './Routes/userRoutes'; 
import cardRoutes from './Routes/cardRoutes'; 
import authRoutes from './Routes/authRoutes'; 
import gameRoutes from './Routes/gameRoutes'; 
import adminRoutes from './Routes/adminRoutes';
import errorMiddleware from "./middleware/errorMiddleware"; 
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './Routes/swaggerConfig';

const app: Express = express();

// Configurações CORS
const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

// MIDDLEWARE GERAL
app.use(cors(corsOptions)); 
app.use(express.json());

// DOCUMENTAÇÃO SWAGGER (Acesse em /docs)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota de teste (Health Check)
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: 'API Online', message: 'API rodando perfeitamente.' });
});

// ANEXA OS ROUTERS
app.use('/auth', authRoutes); 
app.use('/users', userRoutes); 
app.use('/cards', cardRoutes); 
app.use('/game', gameRoutes); 
app.use('/admin', adminRoutes);

// MIDDLEWARE DE TRATAMENTO DE ERROS (DEVE SER O ÚLTIMO app.use)
app.use(errorMiddleware); 

export default app;