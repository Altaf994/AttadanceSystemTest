/*
  Warnings:

  - You are about to drop the column `volunteerId` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the `Volunteer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `firstName` to the `CheckIn` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CheckIn" DROP CONSTRAINT "CheckIn_volunteerId_fkey";

-- AlterTable
ALTER TABLE "CheckIn" DROP COLUMN "volunteerId",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phone" TEXT;

-- DropTable
DROP TABLE "Volunteer";
