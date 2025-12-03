// back/src/routes/cardRoutes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware'; // Importa o middleware
// Importe suas funções de serviço de card: createCard, getCards, updateCard, deleteCard

const cardRouter = Router();

// Rota Pública: Listar todos os cards (necessário para a lógica do jogo)
cardRouter.get('/', async (req, res) => {
    // ... lógica para buscar todos os cards (getCards)
    res.status(200).json(/* cards */);
});

// Rota Protegida: Criar novo card (APENAS Admin/Usuário Autenticado)
// O middleware 'authenticate' é aplicado aqui.
cardRouter.post('/', authenticate, async (req, res) => {
    // ... lógica para criar card (createCard)
    res.status(201).json(/* newCard */);
});

// Rota Protegida: Atualizar card
cardRouter.put('/:id', authenticate, async (req, res) => {
    // ... lógica para atualizar card (updateCard)
    res.status(200).json(/* updatedCard */);
});

// Rota Protegida: Deletar card
cardRouter.delete('/:id', authenticate, async (req, res) => {
    // ... lógica para deletar card (deleteCard)
    res.status(204).send();
});

export default cardRouter;