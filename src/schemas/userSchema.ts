import { z } from 'zod';

// Schema para login (email e senha são obrigatórios e strings)
export const loginSchema = z.object({
    email: z.string().email('Formato de e-mail inválido.').trim(),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
});

// Schema para cadastro (o mesmo do login)
export const registerSchema = loginSchema;

// Schema para atualização de perfil
export const updateProfileSchema = z.object({
    email: z.string().email('Formato de e-mail inválido.').trim().optional(),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').optional(),
}).refine(data => data.email || data.password, {
    message: "Pelo menos um campo (email ou senha) deve ser fornecido para atualização.",
});