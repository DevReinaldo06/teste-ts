// src/server.ts

// 1. Configuração do ambiente: Permite que o servidor leia o arquivo .env
import { config } from 'dotenv'; 

// 2. Importações essenciais:
import app from './app.ts'; // A aplicação Express configurada
import { prisma } from './db/prisma.ts'; // O cliente Prisma para conexão com o DB

// Carrega as variáveis de ambiente do arquivo .env
config(); 

async function main() {
    try {
        console.log('Conectando ao banco de dados...');
        await prisma.$connect();

        // Define a porta (usa a variável de ambiente ou 3000 como padrão)
        const portString = process.env.PORT || '3000';
        const port = parseInt(portString, 10);
        
        // CORREÇÃO CRÍTICA: Escuta em todas as interfaces para evitar ERR_CONNECTION_REFUSED
        const host = '0.0.0.0'; 

        console.log('✅ Banco conectado! Iniciando API...');

        // Inicia o servidor Express com o host e porta definidos
        app.listen(port, host, () => {
            console.log(`🚀 API rodando em http://localhost:${port} (Todas as rotas são livres)`);
            console.log(`(Acessível em: http://127.0.0.1:${port})`);
        });

    } catch (error) {
        // Garante a desconexão em caso de falha
        await prisma.$disconnect(); 
        console.error('❌ FATAL: Falha crítica na inicialização da API.', error);
        process.exit(1);
    }
}

main();