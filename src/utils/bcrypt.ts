// src/utils/bcrypt.ts

import * as bcrypt from 'bcrypt';
// Importa o dotenv para garantir que as variáveis de ambiente sejam carregadas,
// caso este arquivo seja importado antes do arquivo principal do servidor.
import 'dotenv/config'; 

// LÊ A VARIÁVEL DE AMBIENTE:
// - Tenta converter process.env.SALT_ROUNDS para um número inteiro.
// - Se falhar (variável não definida ou não numérica), usa o valor padrão seguro de 10.
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

/**
 * Cria o hash de uma senha.
 */
export const hashPassword = (password: string): Promise<string> => {
    // Usa o SALT_ROUNDS lido do ambiente
    return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compara uma senha em texto simples com um hash.
 */
export const comparePassword = (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};