import 'dotenv/config'; 
import app from './app'; 
import prisma from './db/prisma'; 
import swaggerUi from 'swagger-ui-express'; 
import swaggerSpec from './Routes/swaggerConfig'; // Assumindo que você tem este arquivo
import cors from 'cors';
import { Express } from 'express'; // Importa o tipo Express se necessário, mas 'app' já vem de './app'

// Definição da porta
const port: number = Number(process.env.PORT) || 3000;

// URL COMPLETA DO SEU CLOUD WORKSTATION (sem a barra final)
// Usamos este endereço para configurar o CORS de forma restrita e segura.
const WORKSTATION_URL = 'https://3000-firebase-teste-ts-projeto-1763404463968.cluster-r7kbxfo3fnev2vskbkhhphetq6.cloudworkstations.dev';

// ===============================================
// ✅ CORREÇÃO: APLICAÇÃO DO MIDDLEWARE CORS
// ===============================================
// É crucial aplicar o CORS ANTES de qualquer definição de rota.
app.use(cors({
    origin: WORKSTATION_URL, // Permite apenas requisições desta origem
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Permite os cabeçalhos necessários, incluindo o token JWT
    credentials: true, // Necessário para cookies e cabeçalhos de autenticação
}));

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function main() {
    try {
        // Conecta ao DB e inicializa AdminKey
        await prisma.$connect(); 
        console.log('✅ Conexão com o Banco de Dados estabelecida!');

        // Garante que o servidor escuta em 0.0.0.0 para ser acessível externamente
        app.listen(port, '0.0.0.0', () => {
            console.log(`🚀 API rodando e acessível via URL de Cloud Workstation na porta ${port}.`);
            console.log(`🔗 URL da API: ${WORKSTATION_URL}`); 
        });
        
    } catch (error) {
        console.error('❌ FATAL: Falha ao conectar ao Banco de Dados. A API não será iniciada.', error);
        await prisma.$disconnect(); 
        process.exit(1); 
    }
}

main();