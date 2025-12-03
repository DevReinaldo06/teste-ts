// src/services/adminService.ts

import { prisma } from '../db/prisma';

/**
 * Busca o hash da chave de administrador (adminKeyHash) da tabela AdminConfig.
 * O ID 1 é fixo, conforme definido na lógica de inicialização (prisma.ts).
 */
export async function getAdminKeyHash() {
    return prisma.adminConfig.findUnique({
        where: { id: 1 },
        select: { adminKeyHash: true }
    });
}