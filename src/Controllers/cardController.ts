import { Request, Response, NextFunction } from 'express'; // ⬅️ Adicionado NextFunction
import cardService from '../Services/cardService'; // Importa o Service de Cards
import { Card } from '@prisma/client'; // Importa o tipo Card
// ⬅️ Importação das classes de erro da API
import { BadRequestError, NotFoundError } from '../errors/ApiError'; 

// Interface para garantir o formato correto dos dados de entrada
interface CardInput {
    imagem: string;
    tipo: string;
    nivel: number; 
    classe: string; 
}

const cardController = {
    // ------------------------------------
    // GET /cards
    // ------------------------------------
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> { // Adicionado next
        try {
            const cards: Card[] = await cardService.getAllCards();
            res.json(cards);
        } catch (error) {
            next(error); // Encaminha qualquer erro para o middleware de erro
        }
    },

    // ------------------------------------
    // GET /cards/:id
    // ------------------------------------
    async getById(req: Request, res: Response, next: NextFunction): Promise<void> { // Adicionado next
        const id: number = parseInt(req.params.id, 10);

        if (isNaN(id) || id <= 0) {
            next(new BadRequestError("ID inválido.")); return; // Substituído res.status(400)
        }

        try {
            const card = await cardService.getCardById(id);
            if (!card) {
                // Se o Service retornar null, é 404.
                next(new NotFoundError("Card não encontrado")); return; // Substituído res.status(404)
            }
            res.json(card);
        } catch (error) {
            next(error); // Encaminha o erro do Service/Prisma para o middleware de erro
        }
    },

    // ------------------------------------
    // POST /cards (Criar Novo Card)
    // ------------------------------------
    async create(req: Request<{}, {}, CardInput>, res: Response, next: NextFunction): Promise<void> { // Adicionado next
        const { imagem, tipo, nivel, classe } = req.body; 

        // 1. Validação de Entrada
        
        // Validação de strings obrigatórias
        if (typeof imagem !== 'string' || imagem.trim() === "") {
            next(new BadRequestError("A imagem é obrigatória.")); return; // Substituído res.status(400)
        }
        if (typeof tipo !== 'string' || tipo.trim() === "") {
            next(new BadRequestError("O tipo é obrigatório.")); return; // Substituído res.status(400)
        }
        if (typeof classe !== 'string' || classe.trim() === "") {
            next(new BadRequestError("A classe é obrigatória.")); return; // Substituído res.status(400)
        }
        
        // Validação de número inteiro positivo
        if (typeof nivel !== 'number' || nivel < 0 || !Number.isInteger(nivel)) {
            next(new BadRequestError("O nível deve ser um número inteiro não negativo.")); return; // Substituído res.status(400)
        }

        try {
            const newCard = await cardService.createCard({ imagem, tipo, nivel, classe });
            res.status(201).json(newCard);
        } catch (error) {
            next(error); // Encaminha o erro para o middleware de erro
        }
    },

    // ------------------------------------
    // PUT /cards/:id (Atualizar Card)
    // ------------------------------------
    async update(req: Request, res: Response, next: NextFunction): Promise<void> { // Adicionado next
        const id: number = parseInt(req.params.id, 10);
        const { imagem, tipo, nivel, classe } = req.body;

        if (isNaN(id) || id <= 0) {
            next(new BadRequestError("ID inválido.")); return; // Substituído res.status(400)
        }

        const updateData: Partial<CardInput> = {};
        let isUpdateDataValid = false;
        
        // Validação e construção do objeto updateData
        if (imagem !== undefined) {
            if (typeof imagem === 'string' && imagem.trim() !== "") {
                updateData.imagem = imagem;
                isUpdateDataValid = true;
            } else {
                next(new BadRequestError("A imagem não pode ser vazia.")); return; // Substituído res.status(400)
            }
        }
        
        if (tipo !== undefined) {
            if (typeof tipo === 'string' && tipo.trim() !== "") {
                updateData.tipo = tipo;
                isUpdateDataValid = true;
            } else {
                next(new BadRequestError("O tipo não pode ser vazio.")); return; // Substituído res.status(400)
            }
        }

        if (classe !== undefined) {
            if (typeof classe === 'string' && classe.trim() !== "") {
                updateData.classe = classe;
                isUpdateDataValid = true;
            } else {
                next(new BadRequestError("A classe não pode ser vazia.")); return; // Substituído res.status(400)
            }
        }
        
        if (nivel !== undefined) {
            if (typeof nivel === 'number' && nivel >= 0 && Number.isInteger(nivel)) {
                updateData.nivel = nivel;
                isUpdateDataValid = true;
            } else {
                next(new BadRequestError("O nível deve ser um número inteiro não negativo.")); return; // Substituído res.status(400)
            }
        }
        
        if (!isUpdateDataValid) {
            next(new BadRequestError("Nenhum dado válido para atualizar foi fornecido.")); return; // Substituído res.status(400)
        }

        try {
            const cardAtualizado = await cardService.updateCard(id, updateData);
            res.json(cardAtualizado);
        } catch (error) {
            // O Service lança NotFoundError ou ConflictError.
            next(error); 
        }
    },

    // ------------------------------------
    // DELETE /cards/:id (Deletar Card)
    // ------------------------------------
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> { // Adicionado next
        const id: number = parseInt(req.params.id, 10);

        if (isNaN(id) || id <= 0) {
            next(new BadRequestError("ID inválido.")); return; // Substituído res.status(400)
        }
        
        try {
            await cardService.deleteCard(id);
            res.status(204).send(); // Resposta de sucesso sem conteúdo
        } catch (error) {
            // O Service lança NotFoundError.
            next(error); 
        }
    }
};

export default cardController;