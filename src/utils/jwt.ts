import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

interface JwtPayload {
    id: number;
    email: string;
    isAdmin: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_padrao';
const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN) || 60 * 60 * 24; // 1 dia

export const createToken = (payload: JwtPayload): string => {
    const options: SignOptions = {
        expiresIn: JWT_EXPIRES_IN,
    };

    return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded as JwtPayload;
    } catch {
        return null;
    }
};
