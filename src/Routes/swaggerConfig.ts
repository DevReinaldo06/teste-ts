import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    // Definições básicas da API (mostrado no topo da página do Swagger)
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API da Clínica Médica (Desafio)',
            version: '1.0.0',
            description: 'Documentação da API RESTful para gerenciamento de usuários e cards, construída com Node.js, Express e Prisma.',
            contact: {
                name: 'Seu Nome', // Mantenha ou altere
                email: 'seu.email@exemplo.com', // Mantenha ou altere
            },
        },
        servers: [
            {
                url: 'http://localhost:3000', // URL base para desenvolvimento local
                description: 'Servidor Local de Desenvolvimento',
            },
        ],
    },
    // Onde o Swagger deve procurar por comentários JSDoc que documentam as rotas
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], 
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;