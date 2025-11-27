import jwt, { Secret } from 'jsonwebtoken';

// Use uma chave secreta do ambiente, crucial para segurança!
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'chave-secreta-default-nao-usar-em-producao';

interface TokenPayload {
    id: number;
    email: string;
    isAdmin: boolean;
}

/**
 * Gera um token JWT para o usuário.
 * @param payload Dados do usuário a serem incluídos no token.
 * @returns O token JWT assinado.
 */
export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d', // Token expira em 7 dias
    });
};

/**
 * Verifica e decodifica um token JWT.
 * @param token O token JWT no formato "Bearer <token>" ou apenas "<token>".
 * @returns O payload do token ou null se for inválido.
 */
export const verifyToken = (token: string): TokenPayload | null => {
    try {
        // Remove 'Bearer ' se presente
        const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        
        const payload = jwt.verify(actualToken, JWT_SECRET) as TokenPayload;
        return payload;
    } catch (error) {
        return null;
    }
};