// src/utils/bcrypt.ts

import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Cria o hash de uma senha.
 */
export const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compara uma senha em texto simples com um hash.
 */
export const comparePassword = (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};