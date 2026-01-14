-- AlterTable
ALTER TABLE "CheckIn" ADD COLUMN     "service" TEXT,
ADD COLUMN     "serviceUnit" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "service" TEXT,
ADD COLUMN     "serviceUnit" TEXT;
