import { Request, Response } from 'express';
import userService from '../Services/userService'; 
import { User } from '@prisma/client'; // Importa apenas o tipo User

// Interface para garantir o formato correto dos dados de entrada
interface UserInput {
    nome: string;
    idade: number; 
    email: string; 
}

const userController = {
    // GET ALL
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const users: User[] = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    },

    // GET BY ID
    async getById(req: Request, res: Response): Promise<void> {
        const id: number = parseInt(req.params.id, 10);

        if (isNaN(id) || id <= 0) {
            res.status(400).json({ message: "ID inválido." }); return;
        }

        try {
            const user = await userService.getUserById(id);
            if (!user) {
                res.status(404).json({ message: "Usuário não encontrado" }); return;
            }
            res.json(user);
        } catch (error) {
            console.error("Erro ao buscar usuário por ID:", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    },

    // POST
    async create(req: Request<{}, {}, UserInput>, res: Response): Promise<void> {
        const { nome, idade, email } = req.body; 

        // Validação de entrada
        if (typeof nome !== 'string' || nome.trim() === "") {
            res.status(400).json({ message: "O nome é obrigatório." }); return;
        }
        if (typeof idade !== 'number' || idade <= 0 || !Number.isInteger(idade)) {
            res.status(400).json({ message: "A idade deve ser um número inteiro positivo." }); return;
        }
        if (typeof email !== 'string' || !email.includes('@') || email.trim().length < 5) {
            res.status(400).json({ message: "O email é obrigatório e deve ser um formato válido." }); return;
        }

        try {
            const newUser = await userService.createUser({ nome, idade, email });
            res.status(201).json(newUser);
        } catch (error) {
            // Tratamento de erro de unicidade (P2002)
            if (error instanceof Error && error.message.startsWith("P2002")) {
                res.status(409).json({ message: "Email já cadastrado. Por favor, use outro email." });
                return;
            }
            console.error("Erro ao criar usuário:", error); 
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    },

    // PUT
    async update(req: Request, res: Response): Promise<void> {
        const id: number = parseInt(req.params.id, 10);
        const { nome, idade, email } = req.body;

        if (isNaN(id) || id <= 0) {
            res.status(400).json({ message: "ID inválido." }); return;
        }

        const updateData: Partial<UserInput> = {};
        let isUpdateDataValid = false;
        
        // Validação de campos de atualização
        if (nome !== undefined && typeof nome === 'string' && nome.trim() !== "") {
            updateData.nome = nome;
            isUpdateDataValid = true;
        } else if (nome !== undefined && (typeof nome !== 'string' || nome.trim() === "")) {
            res.status(400).json({ message: "O nome não pode estar vazio." }); return;
        }
        
        if (idade !== undefined && typeof idade === 'number' && idade > 0 && Number.isInteger(idade)) {
            updateData.idade = idade;
            isUpdateDataValid = true;
        } else if (idade !== undefined && (typeof idade !== 'number' || idade <= 0 || !Number.isInteger(idade))) {
            res.status(400).json({ message: "A idade deve ser um número inteiro positivo." }); return;
        }
        
        if (email !== undefined && typeof email === 'string' && email.includes('@') && email.trim().length >= 5) {
            updateData.email = email;
            isUpdateDataValid = true;
        } else if (email !== undefined) {
             res.status(400).json({ message: "O email deve ser um formato válido." }); return;
        }

        if (!isUpdateDataValid) {
            res.status(400).json({ message: "Nenhum dado válido para atualizar foi fornecido." }); return;
        }

        try {
            const userAtualizado = await userService.updateUser(id, updateData);
            res.json(userAtualizado);
        } catch (error) {
            // Tratamento de erros de unicidade (409) ou não encontrado (404)
            if (error instanceof Error && error.message.startsWith("P2002")) {
                res.status(409).json({ message: "O email fornecido já está em uso por outro usuário." });
                return;
            }
            if (error instanceof Error && error.message.startsWith("P2025")) {
                res.status(404).json({ message: "Usuário não encontrado." });
                return;
            }
            console.error("Erro ao atualizar usuário:", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    },

    // DELETE
    async delete(req: Request, res: Response): Promise<void> {
        const id: number = parseInt(req.params.id, 10);

        if (isNaN(id) || id <= 0) {
            res.status(400).json({ message: "ID inválido." }); return;
        }
        
        try {
            await userService.deleteUser(id);
            res.status(204).send(); 
        } catch (error) {
            if (error instanceof Error && error.message.startsWith("P2025")) {
                res.status(404).json({ message: "Usuário não encontrado." });
                return;
            }
            console.error("Erro ao deletar usuário:", error);
            res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
};

export default userController;