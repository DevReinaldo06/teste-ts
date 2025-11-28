import 'dotenv/config'; 
import app from './app'; 
import prisma from './db/prisma'; 
import swaggerUi from 'swagger-ui-express'; 
import swaggerSpec from './Routes/swaggerConfig'; // Assumindo que você tem este arquivo
import cors from 'cors';

const port: number = Number(process.env.PORT) || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function main() {
    try {
        // Conecta ao DB e inicializa AdminKey
        await prisma.$connect(); 
        console.log('✅ Conexão com o Banco de Dados estabelecida!');

        app.listen(port, () => {
            console.log(`🚀 API rodando em http://localhost:${port}.`);
            console.log(`📘 Documentação Swagger em http://localhost:${port}/api-docs`); 
        });
        
    } catch (error) {
        console.error('❌ FATAL: Falha ao conectar ao Banco de Dados. A API não será iniciada.', error);
        await prisma.$disconnect(); 
        process.exit(1); 
    }
}

main();