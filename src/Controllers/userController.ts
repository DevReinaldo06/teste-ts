import { Request, Response, NextFunction } from 'express'; // ⬅️ Adicionado NextFunction
import userService from '../Services/userService'; 
import { User } from '@prisma/client'; 
// CORREÇÃO: Adicionando NotFoundError à importação
import { BadRequestError, NotFoundError } from '../errors/ApiError'; // ⬅️ Adicionado para validação 400

// Interface para garantir o formato correto dos dados de entrada
interface UserInput {
    nome: string;
    idade: number; 
    email: string; 
}

const userController = {
    // GET ALL
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users: User[] = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            next(error); // Encaminha qualquer erro para o middleware de erro
        }
    },

    // GET BY ID
    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id: number = parseInt(req.params.id, 10);

        if (isNaN(id) || id <= 0) {
            next(new BadRequestError("ID inválido.")); return;
        }

        try {
            const user = await userService.getUserById(id);
            if (!user) {
                // Se o Service retornar null, é 404. O Service não lança erro aqui, então tratamos o 404.
                next(new NotFoundError("Usuário não encontrado")); return;
            }
            res.json(user);
        } catch (error) {
            next(error); 
        }
    },

    // POST
    async create(req: Request<{}, {}, UserInput>, res: Response, next: NextFunction): Promise<void> {
        const { nome, idade, email } = req.body; 

        // Validação de entrada (Continua no Controller, mas usa BadRequestError)
        if (typeof nome !== 'string' || nome.trim() === "") {
            next(new BadRequestError("O nome é obrigatório.")); return;
        }
        if (typeof idade !== 'number' || idade <= 0 || !Number.isInteger(idade)) {
            next(new BadRequestError("A idade deve ser um número inteiro positivo.")); return;
        }
        // Validação de email: se o Service falhar com P2002, o erro (ConflictError) será capturado.
        if (typeof email !== 'string' || !email.includes('@') || email.trim().length < 5) {
            next(new BadRequestError("O email é obrigatório e deve ser um formato válido.")); return;
        }

        try {
            const newUser = await userService.createUser({ nome, idade, email });
            res.status(201).json(newUser);
        } catch (error) {
            next(error); // Erros de conflito (P2002) vêm do Service e são capturados pelo middleware.
        }
    },

    // PUT
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id: number = parseInt(req.params.id, 10);
        const { nome, idade, email } = req.body;

        if (isNaN(id) || id <= 0) {
            next(new BadRequestError("ID inválido.")); return;
        }
        
        // ... (Mantenha a lógica de validação de updateData, substituindo res.status(400) por next(new BadRequestError(...)))

        const updateData: Partial<UserInput> = {};
        let isUpdateDataValid = false;
        
        // Validação de campos de atualização
        if (nome !== undefined) {
            if (typeof nome === 'string' && nome.trim() !== "") {
                updateData.nome = nome;
                isUpdateDataValid = true;
            } else {
                next(new BadRequestError("O nome não pode estar vazio.")); return;
            }
        }
        
        if (idade !== undefined) {
            if (typeof idade === 'number' && idade > 0 && Number.isInteger(idade)) {
                updateData.idade = idade;
                isUpdateDataValid = true;
            } else {
                next(new BadRequestError("A idade deve ser um número inteiro positivo.")); return;
            }
        }
        
        if (email !== undefined) {
            if (typeof email === 'string' && email.includes('@') && email.trim().length >= 5) {
                updateData.email = email;
                isUpdateDataValid = true;
            } else {
                next(new BadRequestError("O email deve ser um formato válido.")); return;
            }
        }

        if (!isUpdateDataValid) {
            next(new BadRequestError("Nenhum dado válido para atualizar foi fornecido.")); return;
        }

        try {
            const userAtualizado = await userService.updateUser(id, updateData);
            res.json(userAtualizado);
        } catch (error) {
            next(error); // Erros NotFound ou Conflict vêm do Service.
        }
    },

    // DELETE
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id: number = parseInt(req.params.id, 10);

        if (isNaN(id) || id <= 0) {
            next(new BadRequestError("ID inválido.")); return;
        }
        
        try {
            await userService.deleteUser(id);
            res.status(204).send(); 
        } catch (error) {
            next(error); // Erros NotFound vêm do Service.
        }
    }
};

export default userController;