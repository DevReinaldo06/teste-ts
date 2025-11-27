/*
  Warnings:

  - You are about to drop the column `idade` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Card" ADD COLUMN     "imagemRevelada" TEXT NOT NULL DEFAULT 'URL Placeholder',
ADD COLUMN     "nome" TEXT NOT NULL DEFAULT 'Nome';

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "idade",
DROP COLUMN "nome",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT NOT NULL DEFAULT 'TEMPORARY_PASSWORD_NEEDS_HASH';

-- CreateTable
CREATE TABLE "public"."AdminConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "adminKeyHash" TEXT NOT NULL,

    CONSTRAINT "AdminConfig_pkey" PRIMARY KEY ("id")
);
