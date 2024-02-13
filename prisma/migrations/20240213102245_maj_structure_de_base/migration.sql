/*
  Warnings:

  - You are about to drop the column `dateFin` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "dateFin";

-- CreateTable
CREATE TABLE "MetasModule" (
    "id" SERIAL NOT NULL,
    "resumeProgramme" TEXT NOT NULL,
    "objectifs" TEXT NOT NULL,
    "duree" TEXT NOT NULL,
    "publicCible" TEXT NOT NULL,
    "tarif" TEXT NOT NULL,
    "programmeModule" JSONB NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "MetasModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetasSession" (
    "id" SERIAL NOT NULL,
    "dateHoraires" TEXT NOT NULL,
    "lieuRencontre" TEXT NOT NULL,
    "nombrePlaces" TEXT NOT NULL,
    "infosTransport" TEXT NOT NULL,
    "dateLimiteInscription" TEXT NOT NULL,
    "infosComplementaires" TEXT NOT NULL,
    "intervenants" JSONB NOT NULL,
    "programmeSession" JSONB NOT NULL,
    "urlsPDF" JSONB NOT NULL,
    "sessionId" INTEGER NOT NULL,

    CONSTRAINT "MetasSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MetasModule_moduleId_key" ON "MetasModule"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "MetasSession_sessionId_key" ON "MetasSession"("sessionId");

-- AddForeignKey
ALTER TABLE "MetasModule" ADD CONSTRAINT "MetasModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetasSession" ADD CONSTRAINT "MetasSession_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
