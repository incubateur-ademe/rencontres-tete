/*
  Warnings:

  - You are about to drop the column `pays` on the `Registration` table. All the data in the column will be lost.
  - Added the required column `region` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "pays",
ADD COLUMN     "region" TEXT NOT NULL;
