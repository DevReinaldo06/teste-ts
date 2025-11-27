import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/bcrypt'; // NOVO IMPORT

const prisma = new PrismaClient();

// ⚠️ NOVO: Garante a inicialização de uma AdminKey Padrão
async function createAdminKeyConfig() {
    // Verifica se a configuração já existe
    const existingConfig = await prisma.adminConfig.findUnique({
        where: { id: 1 },
    });

    if (!existingConfig) {
        console.log('ℹ️ Criando hash de AdminKey padrão (123456)...');
        // ⚠️ ATENÇÃO: Use uma chave mais segura em produção!
        const defaultKeyHash = await hashPassword('123456'); 
        
        await prisma.adminConfig.create({
            data: {
                id: 1,
                adminKeyHash: defaultKeyHash,
            },
        });
    }
}

// ⚠️ NOVO: Conecta e inicializa a AdminKey
prisma.$connect = async () => {
    await PrismaClient.prototype.$connect.call(prisma);
    await createAdminKeyConfig();
};

export default prisma;