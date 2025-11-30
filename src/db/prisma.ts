// src/db/prisma.ts (CORRIGIDO)

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/bcrypt'; 
import 'dotenv/config'; 

const prisma = new PrismaClient(); 

// ------------------------------
// 2. Lógica de Inicialização (AdminKey) - Mantemos a função aqui.
// ------------------------------
export async function createAdminKeyConfig() { // ⚠️ EXPORTE A FUNÇÃO
    const defaultAdminKey = '123456';
    const existingConfig = await prisma.adminConfig.findUnique({
        where: { id: 1 },
    });

    if (!existingConfig) {
        console.log('ℹ️ Criando hash de AdminKey padrão (123456)...');
        const defaultKeyHash = await hashPassword(defaultAdminKey); 
        
        await prisma.adminConfig.create({
            data: {
                id: 1,
                adminKeyHash: defaultKeyHash,
            },
        });
    }
}


// ------------------------------
// 3. Função de Conexão e Inicialização - REMOVIDA
// ------------------------------
// REMOVA A FUNÇÃO connectAndInitialize() INTEIRA OU,
// SE QUISER MANTÊ-LA, REMOVA A CHAMADA NO FINAL:
// connectAndInitialize(); // <--- ❌ REMOVA ESTA LINHA!

// ------------------------------
// 4. EXPORTAÇÃO PADRÃO
// ------------------------------
export default prisma;