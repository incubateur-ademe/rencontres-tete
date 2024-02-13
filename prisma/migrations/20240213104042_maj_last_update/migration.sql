-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "lastUpdate" TIMESTAMP(3),
ALTER COLUMN "datePublication" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "datePublication" TIMESTAMP(3),
ADD COLUMN     "lastUpdate" TIMESTAMP(3);
