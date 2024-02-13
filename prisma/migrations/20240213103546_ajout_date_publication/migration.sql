/*
  Warnings:

  - Added the required column `datePublication` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "datePublication" TIMESTAMP(3) NOT NULL;
