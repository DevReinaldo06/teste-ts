// src/server.ts

import app from './app'; 
import { prisma, createAdminKeyConfig } from './db/prisma'; 
import 'dotenv/config';

async function main() {
    try {
        console.log('Conectando ao banco de dados...');
        await prisma.$connect();

        // Garante que a chave de admin seja criada se não existir
        await createAdminKeyConfig(); 
        
        // Define a porta
        const port = process.env.PORT || 3000;

        console.log('✅ Banco conectado! Iniciando API...');

        app.listen(port, () => {
            console.log(`🚀 API rodando em http://localhost:${port}`);
        });

    } catch (error) {
        console.error('❌ FATAL: Falha ao conectar ao Banco de Dados. A API não será iniciada.', error);
        process.exit(1);
    }
}

main();