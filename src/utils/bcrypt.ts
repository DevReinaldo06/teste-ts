import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Cria o hash de uma senha.
 * @param password Senha em texto simples.
 * @returns O hash da senha.
 */
export const hashPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compara uma senha em texto simples com um hash.
 * @param password Senha em texto simples.
 * @param hash Hash a ser comparado.
 * @returns true se as senhas coincidirem, false caso contrário.
 */
export const comparePassword = (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};