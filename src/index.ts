// src/index.ts (CORRIGIDO)

import 'dotenv/config'; 
import app from './app'; 
import prisma, { createAdminKeyConfig } from './db/prisma';
import swaggerUi from 'swagger-ui-express'; 
import swaggerSpec from './Routes/swaggerConfig'; // Adicionei este import assumindo sua necessidade
import cors from 'cors'; // Adicionei este import assumindo sua necessidade

// ===============================================
// ✅ ADICIONE AS VARIÁVEIS AUSENTES AQUI!
// ===============================================

// Definição da porta
const port: number = Number(process.env.PORT) || 3000; // Variável 'port' declarada

// URL COMPLETA DO SEU CLOUD WORKSTATION (sem a barra final)
const WORKSTATION_URL = process.env.WORKSTATION_URL || 'https://3000-firebase-teste-ts-projeto-1763404463968.cluster-r7kbxfo3fnev2vskbkhhphetq6.cloudworkstations.dev'; // Variável 'WORKSTATION_URL' declarada


// ===============================================
// ✅ ADICIONE O MIDDLEWARE DE CORS AQUI!
// ===============================================
// Aplicação do CORS
app.use(cors({
    origin: WORKSTATION_URL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true,
}));

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// ===============================================
// FUNÇÃO PRINCIPAL
// ===============================================

async function main() {
    try {
        // Conecta ao DB
        await prisma.$connect(); 
        
        // Inicializa a AdminKey
        await createAdminKeyConfig();

        console.log('✅ Conexão com o Banco de Dados estabelecida!');

        // Garante que o servidor escuta em 0.0.0.0 para ser acessível externamente
        app.listen(port, '0.0.0.0', () => { // Variável 'port' e 'WORKSTATION_URL' AGORA ESTÃO DEFINIDAS
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