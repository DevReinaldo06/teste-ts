// src/db/prisma.ts

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/bcrypt';
import 'dotenv/config';

export const prisma = new PrismaClient();

// ------------------------------
// Lógica de Inicialização (AdminKey)
// ------------------------------
export async function createAdminKeyConfig() {
    // Lê a chave inicial de uma variável de ambiente
    const initialAdminKey = process.env.INITIAL_ADMIN_KEY || 'chave-admin-segura-padrao-dev-123'; 

    if (initialAdminKey === 'chave-admin-segura-padrao-dev-123') {
        console.warn('⚠️ AVISO DE SEGURANÇA: Usando chave de administrador padrão de desenvolvimento. Altere INITIAL_ADMIN_KEY no seu arquivo .env!');
    }

    const existingConfig = await prisma.adminConfig.findUnique({
        where: { id: 1 },
    });

    if (!existingConfig) {
        console.log(`ℹ️ Criando hash de AdminKey inicial. Chave: ${initialAdminKey.substring(0, 5)}...`);
        const initialKeyHash = await hashPassword(initialAdminKey);

        await prisma.adminConfig.create({
            data: {
                id: 1,
                adminKeyHash: initialKeyHash,
            },
        });
        console.log('✅ Configuração de AdminKey criada e hasheada.');
    }
}