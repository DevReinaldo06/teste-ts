import { Router, Request, Response } from 'express';
// import { adminKey } from '../config/adminConfig'; // REMOVIDO: A chave agora será buscada no DB
import { 
    createUser, 
    findUser, 
    findUserByEmail, 
    deleteUser,
} from '../services/userService';
import { comparePassword } from '../utils/bcrypt'; // NOVO: Para comparar o hash do Admin
import { getAdminKeyHash } from '../Services/adminService'; // NOVO: Para buscar o hash do DB

const authRouter = Router();

// ----------------------------------------------------------------------
/**
 * Rota 1: Verifica a Chave de Administrador (AGORA SEGURA COM HASH NO DB)
 */
authRouter.post('/admin-key', async (req: Request, res: Response) => {
    const { password } = req.body;
    
    if (!password) {
        return res.status(400).json({ message: "A senha do administrador é obrigatória." });
    }

    try {
        // 1. Busca o hash salvo na tabela AdminConfig (ID 1)
        const adminConfig = await getAdminKeyHash();
        
        if (!adminConfig) {
             // Isso só deve ocorrer se a tabela AdminConfig nunca foi inicializada.
             return res.status(500).json({ message: "Erro de configuração: Chave Admin não inicializada." });
        }
        
        // 2. Compara a senha de texto simples fornecida com o hash salvo no DB
        const keyMatch = await comparePassword(password, adminConfig.adminKeyHash);
        
        if (keyMatch) {
            // Sucesso: Retorna true e um token simples (ou JWT real)
            return res.status(200).json({ 
                adminKeyValid: true, 
                message: "Acesso Administrativo concedido.",
                token: "admin-access-token-123" 
            });
        } else {
            return res.status(401).json({ 
                adminKeyValid: false, 
                message: "Chave de Acesso inválida." 
            });
        }
    } catch (error) {
        console.error("Erro na verificação do AdminKey:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});

// ----------------------------------------------------------------------
/**
 * Rota 2: Login de Usuário
 */
authRouter.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    try {
        const user = await findUser(email, password);
        
        if (user) {
            return res.status(200).json({ 
                user: {
                    id: user.id,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    // OBS: A senha (user.password) foi REMOVIDA daqui por segurança!
                },
                message: "Login bem-sucedido." 
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
    // ... (O código aqui não foi alterado pois estava correto)
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
            message: "Registro bem-sucedido. Faça login." 
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
    // ... (O código aqui não foi alterado pois estava correto)
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