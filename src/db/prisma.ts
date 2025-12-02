import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/bcrypt';
import 'dotenv/config';

export const prisma = new PrismaClient();

// ------------------------------
// 2. Lógica de Inicialização (AdminKey)
// ------------------------------
export async function createAdminKeyConfig() {
  const defaultAdminKey = '123456';

  const existingConfig = await prisma.adminConfig.findUnique({
    where: { id: 1 },
  });

  if (!existingConfig) {
    console.log('ℹ️ Criando hash de AdminKey padrão (123456)...');
    const defaultKeyHash = await hashPassword(defaultAdminKey);

    await prisma.adminConfig.create({
      data: {
        id: 1,
        adminKeyHash: defaultKeyHash,
      },
    });
  }
}
