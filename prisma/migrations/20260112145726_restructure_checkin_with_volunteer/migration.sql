/*
  Warnings:

  - You are about to drop the column `checkedInAt` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the column `checkedOutAt` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `CheckIn` table. All the data in the column will be lost.
  - Added the required column `volunteerId` to the `CheckIn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CheckIn" DROP COLUMN "checkedInAt",
DROP COLUMN "checkedOutAt",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "notes",
DROP COLUMN "phone",
ADD COLUMN     "checkinAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "checkoutAt" TIMESTAMP(3),
ADD COLUMN     "takenByUserId" TEXT,
ADD COLUMN     "volunteerId" TEXT NOT NULL,
ADD COLUMN     "volunteerName" TEXT;

-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "service" TEXT,
    "serviceUnit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
