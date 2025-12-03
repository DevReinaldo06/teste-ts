// src/db/prisma.ts

import { PrismaClient } from '@prisma/client';
// REMOVER: import { Pool } from 'pg'; 
// REMOVER: import { PrismaPg } from '@prisma/adapter-pg'; 
// REMOVER: A feature Driver Adapter não será mais usada

// O PrismaClient se conectará diretamente à DATABASE_URL do process.env
// (que deve ter sido carregado pelo 'dotenv' no src/server.ts)

export const prisma = new PrismaClient({
    // Você pode adicionar logs ou configurações aqui, mas o adaptador é removido.
});

// A função createAdminKeyConfig
/*
export async function createAdminKeyConfig() {
    console.log('ℹ️ Configuração de AdminKey desativada, pulando inicialização.');
}
*/