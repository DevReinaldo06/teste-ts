import express from 'express';
import { prisma, createAdminKeyConfig } from './db/prisma';
import 'dotenv/config';

const app = express();
app.use(express.json());

async function main() {
  try {
    console.log('Conectando ao banco...');
    await prisma.$connect();

    await createAdminKeyConfig();

    console.log('Banco conectado! Iniciando API...');

    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 API rodando na porta ${process.env.PORT || 3000}`);
    });

  } catch (error) {
    console.error('❌ FATAL: Falha ao conectar ao Banco de Dados. A API não será iniciada.', error);
    process.exit(1);
  }
}

main();
