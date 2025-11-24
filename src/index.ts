import 'dotenv/config'; 
import app from './app'; 
import prisma from './db/prisma'; 

const port: number = 3000;

async function main() {
    try {
        // Conecta ao BD usando o módulo centralizado
        await prisma.$connect();
        console.log('✅ Conexão com o Banco de Dados (Render) estabelecida!');

        // Inicia o servidor Express
        app.listen(port, () => {
            console.log(`🚀 API de Usuários rodando em http://localhost:${port}. Rotas: /users`);
        });
        
    } catch (error) {
        console.error('❌ FATAL: Falha ao conectar ao Banco de Dados. A API não será iniciada.', error);
        process.exit(1); 
    }
}

main();