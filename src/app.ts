// src/app.ts
import express from 'express';
import cors from 'cors';
// Não inclua cardRouter, userRouter, etc., aqui!
import mainRouter from './Routes/index.ts'; 


const app = express();

// Middlewares e configurações de CORS e JSON...
app.use(cors({ /* ... */ }));
app.use(express.json());

// Rota de status...
app.get('/status', (req, res) => {
    res.status(200).json({ status: 'API está a funcionar.' });
});

// Conexão na raiz: Isso garante que /users, /cards, /auth funcionem.
app.use('/', mainRouter); 

export default app;