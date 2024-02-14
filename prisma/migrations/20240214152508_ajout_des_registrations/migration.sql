/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Module` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Registration" (
    "id" SERIAL NOT NULL,
    "civilite" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "structure" TEXT NOT NULL,
    "fonction" TEXT,
    "typeFonction" TEXT NOT NULL,
    "ville" TEXT,
    "pays" TEXT NOT NULL,
    "telephone" TEXT,
    "transport" TEXT,
    "besoins" TEXT,
    "repas" BOOLEAN NOT NULL,
    "covoit" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Module_slug_key" ON "Module"("slug");

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
