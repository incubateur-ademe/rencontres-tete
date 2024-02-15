/*
  Warnings:

  - Added the required column `code` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "code" TEXT NOT NULL;
