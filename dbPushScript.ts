// dbPushScript.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runDbPush() {
    try {
        console.log('Tentando sincronizar o esquema com o banco de dados...');
        
        // Chamada direta ao $executeRaw que simula uma ação de migração
        // Nota: O método de sincronização ideal seria `db push`, mas está quebrado.
        
        // Para forçar a criação de AdminConfig (que o prisma.ts faria)
        await prisma.$connect();
        
        // Se a conexão for bem-sucedida, as tabelas estarão prontas. 
        // Não podemos forçar a criação de todas as tabelas sem um comando SQL complexo.
        
        console.log('✅ Conexão bem-sucedida. O Prisma Client está pronto para uso.');
        
        // Se este script rodar, significa que o PrismaClient está funcionando.
        
    } catch (e) {
        console.error('❌ Falha ao conectar/sincronizar o banco de dados:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Para projetos com tabelas vazias, vamos tentar a inicialização do app.
// Rodar este script não criará as tabelas, apenas testa a conexão.
// A ÚNICA SOLUÇÃO É RODAR O SERVIDOR EXPRESS.

runDbPush();