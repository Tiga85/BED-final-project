-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_hostId_fkey";

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "hostId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("id") ON DELETE SET NULL ON UPDATE CASCADE;
