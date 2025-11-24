import { Request, Response } from 'express';
import cardService from '../Services/cardService'; // Importa o Service de Cards
import { Card } from '@prisma/client'; // Importa o tipo Card

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
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const cards: Card[] = await cardService.getAllCards();
            res.json(cards);
        } catch (error) {
            console.error("Erro ao buscar cards:", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    },

    // ------------------------------------
    // GET /cards/:id
    // ------------------------------------
    async getById(req: Request, res: Response): Promise<void> {
        const id: number = parseInt(req.params.id, 10);

        if (isNaN(id) || id <= 0) {
            res.status(400).json({ message: "ID inválido." }); return;
        }

        try {
            const card = await cardService.getCardById(id);
            if (!card) {
                res.status(404).json({ message: "Card não encontrado" }); return;
            }
            res.json(card);
        } catch (error) {
            console.error("Erro ao buscar card por ID:", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    },

    // ------------------------------------
    // POST /cards (Criar Novo Card)
    // ------------------------------------
    async create(req: Request<{}, {}, CardInput>, res: Response): Promise<void> {
        const { imagem, tipo, nivel, classe } = req.body; 

        // 1. Validação de Entrada (Responsabilidade do Controller)
        
        // Validação de strings obrigatórias
        if (typeof imagem !== 'string' || imagem.trim() === "") {
            res.status(400).json({ message: "A imagem é obrigatória." }); return;
        }
        if (typeof tipo !== 'string' || tipo.trim() === "") {
            res.status(400).json({ message: "O tipo é obrigatório." }); return;
        }
        if (typeof classe !== 'string' || classe.trim() === "") {
            res.status(400).json({ message: "A classe é obrigatória." }); return;
        }
        
        // Validação de número inteiro positivo
        if (typeof nivel !== 'number' || nivel < 0 || !Number.isInteger(nivel)) {
            res.status(400).json({ message: "O nível deve ser um número inteiro não negativo." }); return;
        }

        try {
            const newCard = await cardService.createCard({ imagem, tipo, nivel, classe });
            res.status(201).json(newCard);
        } catch (error) {
            console.error("Erro ao criar card:", error); 
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    },

    // ------------------------------------
    // PUT /cards/:id (Atualizar Card)
    // ------------------------------------
    async update(req: Request, res: Response): Promise<void> {
        const id: number = parseInt(req.params.id, 10);
        const { imagem, tipo, nivel, classe } = req.body;

        if (isNaN(id) || id <= 0) {
            res.status(400).json({ message: "ID inválido." }); return;
        }

        const updateData: Partial<CardInput> = {};
        let isUpdateDataValid = false;
        
        // Validação e construção do objeto updateData
        if (imagem !== undefined && typeof imagem === 'string' && imagem.trim() !== "") {
            updateData.imagem = imagem;
            isUpdateDataValid = true;
        } else if (imagem !== undefined) {
            res.status(400).json({ message: "A imagem não pode ser vazia." }); return;
        }
        
        if (tipo !== undefined && typeof tipo === 'string' && tipo.trim() !== "") {
            updateData.tipo = tipo;
            isUpdateDataValid = true;
        } else if (tipo !== undefined) {
            res.status(400).json({ message: "O tipo não pode ser vazio." }); return;
        }

        if (classe !== undefined && typeof classe === 'string' && classe.trim() !== "") {
            updateData.classe = classe;
            isUpdateDataValid = true;
        } else if (classe !== undefined) {
            res.status(400).json({ message: "A classe não pode ser vazia." }); return;
        }
        
        if (nivel !== undefined && typeof nivel === 'number' && nivel >= 0 && Number.isInteger(nivel)) {
            updateData.nivel = nivel;
            isUpdateDataValid = true;
        } else if (nivel !== undefined) {
            res.status(400).json({ message: "O nível deve ser um número inteiro não negativo." }); return;
        }
        
        if (!isUpdateDataValid) {
            res.status(400).json({ message: "Nenhum dado válido para atualizar foi fornecido." }); return;
        }

        try {
            const cardAtualizado = await cardService.updateCard(id, updateData);
            res.json(cardAtualizado);
        } catch (error) {
            // Tratamento de erro de Card não encontrado (404)
            if (error instanceof Error && error.message.startsWith("P2025")) {
                res.status(404).json({ message: "Card não encontrado." });
                return;
            }
            console.error("Erro ao atualizar card:", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    },

    // ------------------------------------
    // DELETE /cards/:id (Deletar Card)
    // ------------------------------------
    async delete(req: Request, res: Response): Promise<void> {
        const id: number = parseInt(req.params.id, 10);

        if (isNaN(id) || id <= 0) {
            res.status(400).json({ message: "ID inválido." }); return;
        }
        
        try {
            await cardService.deleteCard(id);
            res.status(204).send(); // Resposta de sucesso sem conteúdo
        } catch (error) {
            // Tratamento de erro de Card não encontrado (404)
            if (error instanceof Error && error.message.startsWith("P2025")) {
                res.status(404).json({ message: "Card não encontrado." });
                return;
            }
            console.error("Erro ao deletar card:", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
};

export default cardController;