/*
  Warnings:

  - You are about to drop the column `covoit` on the `Registration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MetasSession" ADD COLUMN     "nombreJours" INTEGER;

-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "covoit",
ADD COLUMN     "repas2" BOOLEAN;
