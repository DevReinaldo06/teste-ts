import { z } from 'zod';

export const cardSchema = z.object({
    nome: z.string().min(1, 'O nome do card é obrigatório.'),
    imagem: z.string().url('A URL da imagem misteriosa é inválida.'),
    imagemRevelada: z.string().url('A URL da imagem revelada é inválida.'),
    tipo: z.string().min(1, 'O tipo do card é obrigatório.'),
    nivel: z.number().int().min(1).max(12, 'O nível deve ser entre 1 e 12.'),
    classe: z.string().min(1, 'A classe (elemento) do card é obrigatória.'),
});