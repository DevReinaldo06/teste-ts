// src/db/prisma.ts (CORRIGIDO PARA SINTAXE PRISMA 6.x)

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/bcrypt'; 
import 'dotenv/config'; 
// NÃO PRECISA DE @prisma/adapter-pg nem pg


// ------------------------------
// 1. PRISMA CLIENT (Sintaxe V6)
// ------------------------------
// O Prisma Client lê a DATABASE_URL do .env automaticamente.
const prisma = new PrismaClient(); 

// ------------------------------
// 2. Lógica de Inicialização (AdminKey)
// ------------------------------
// Esta lógica garante que a AdminKey seja criada no DB se não existir.
async function createAdminKeyConfig() {
    const defaultAdminKey = '123456';
    const existingConfig = await prisma.adminConfig.findUnique({
        where: { id: 1 },
    });

    if (!existingConfig) {
        console.log('ℹ️ Criando hash de AdminKey padrão (123456)...');
        // Importante: Seu código de hash deve ser robusto!
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
// 3. Função de Conexão e Inicialização
// ------------------------------
// Esta função é chamada no index.ts
async function connectAndInitialize() {
  try {
    await prisma.$connect();
    // ✅ CHAMAR A CRIAÇÃO DE ADMIN KEY
    await createAdminKeyConfig(); 
    // Console log para o index.ts saber que a conexão foi feita
    console.log('✅ Conexão com o Banco de Dados estabelecida!'); 
  } catch (err) {
    console.error('❌ FATAL: Erro ao conectar/inicializar Prisma:', err);
    process.exit(1);
  }
}

connectAndInitialize();


// ------------------------------
// 4. EXPORTAÇÃO PADRÃO
// ------------------------------
export default prisma;