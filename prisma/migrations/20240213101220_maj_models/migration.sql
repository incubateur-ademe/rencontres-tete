/*
  Warnings:

  - You are about to drop the column `informations` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `contenu` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `parametres` on the `Session` table. All the data in the column will be lost.
  - Added the required column `pilier` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thematique` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departement` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Module" DROP COLUMN "informations",
DROP COLUMN "metadata",
ADD COLUMN     "pilier" TEXT NOT NULL,
ADD COLUMN     "thematique" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "contenu",
DROP COLUMN "nom",
DROP COLUMN "parametres",
ADD COLUMN     "departement" TEXT NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL;
