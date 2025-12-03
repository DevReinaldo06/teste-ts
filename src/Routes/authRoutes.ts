// src/Routes/authRoutes.ts

import { Router, Request, Response } from 'express';
// Importações de segurança (bcrypt, adminService) foram removidas
import { 
    findUser, 
    findUserByEmail, 
    deleteUser,
    createUser, // Incluído para clareza
// 💡 CORREÇÃO: Adicionando a extensão .js no final
} from '../Services/userService.ts'; 

const authRouter = Router();

// ----------------------------------------------------------------------
/**
 * Rota 1: Rota de AdminKey REMOVIDA
 */
authRouter.post('/admin-key', (req: Request, res: Response) => {
    // Retorna um sucesso simulado já que a autenticação está desativada
    return res.status(200).json({ 
        adminKeyValid: true, 
        message: "Acesso Administrativo concedido (Simulado).",
        token: "admin-access-token-simulado" 
    });
});

// ----------------------------------------------------------------------
/**
 * Rota 2: Login de Usuário (Apenas busca o usuário para fins de UI)
 */
authRouter.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    try {
        // Apenas valida se o usuário e senha existem no DB, não há mais geração de token
        const user = await findUser(email, password);
        
        if (user) {
            return res.status(200).json({ 
                user: {
                    id: user.id,
                    email: user.email,
                    isAdmin: user.isAdmin,
                },
                message: "Login bem-sucedido (Apenas simulação)." 
            });
        } else {
            return res.status(401).json({ message: "Email ou senha incorretos." });
        }
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ message: "Erro interno do servidor durante o login." });
    }
});

// ----------------------------------------------------------------------
/**
 * Rota 3: Registro de Usuário
 */
authRouter.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios para o registro." });
    }

    try {
        const userExists = await findUserByEmail(email);
        if (userExists) {
            return res.status(409).json({ message: "Este e-mail já está cadastrado." });
        }

        const newUser = await createUser(email, password);
        
        return res.status(201).json({ 
            user: {
                id: newUser.id,
                email: newUser.email,
                isAdmin: newUser.isAdmin
            },
            message: "Registro bem-sucedido." 
        });

    } catch (error) {
        console.error("Erro no registro:", error);
        return res.status(500).json({ message: "Erro interno do servidor durante o registro." });
    }
});

// ----------------------------------------------------------------------
/**
 * Rota 4: Deleta Usuário
 */
authRouter.delete('/user/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
        await deleteUser(id);
        return res.status(200).json({ message: "Usuário excluído com sucesso." });
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return res.status(500).json({ message: "Erro ao excluir usuário." });
    }
});

export default authRouter;