/*
  Warnings:

  - You are about to drop the column `eventId` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the `Volunteer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `event` to the `CheckIn` table without a default value. This is not possible if the table is not empty.
  - Made the column `volunteerName` on table `CheckIn` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CheckIn" DROP CONSTRAINT "CheckIn_eventId_fkey";

-- DropForeignKey
ALTER TABLE "CheckIn" DROP CONSTRAINT "CheckIn_volunteerId_fkey";

-- AlterTable
ALTER TABLE "CheckIn" DROP COLUMN "eventId",
ADD COLUMN     "event" TEXT NOT NULL,
ALTER COLUMN "volunteerName" SET NOT NULL;

-- DropTable
DROP TABLE "Volunteer";
