// src/db/prisma.ts

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/bcrypt';
import 'dotenv/config';

export const prisma = new PrismaClient();

// ------------------------------
// Lógica de Inicialização (AdminKey)
// ------------------------------
export async function createAdminKeyConfig() {
    // Agora lê a chave de acesso simples definida para rotas (ADMIN_KEY)
    // Se o propósito aqui for *hashear a senha para uma rota de login*, use ADMIN_KEY.
    const adminAccessKey = process.env.ADMIN_KEY || 'chave-admin-segura-padrao-dev-123'; 

    if (adminAccessKey === 'chave-admin-segura-padrao-dev-123') {
        console.warn('⚠️ AVISO DE SEGURANÇA: Usando chave de administrador padrão de desenvolvimento. Altere ADMIN_KEY no seu arquivo .env!');
    }

    const existingConfig = await prisma.adminConfig.findUnique({
        where: { id: 1 },
    });

    if (!existingConfig) {
        console.log(`ℹ️ Criando hash de AdminKey inicial. Chave: ${adminAccessKey.substring(0, 5)}...`);
        
        // 1. Hasheia a chave lida do .env
        const initialKeyHash = await hashPassword(adminAccessKey);

        // 2. Salva o hash no banco de dados para futura comparação (na rota /admin-key)
        await prisma.adminConfig.create({
            data: {
                id: 1,
                adminKeyHash: initialKeyHash,
            },
        });
        console.log('✅ Configuração de AdminKey criada e hasheada.');
    }
}