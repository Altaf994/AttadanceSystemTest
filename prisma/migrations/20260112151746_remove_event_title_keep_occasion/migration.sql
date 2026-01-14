/*
  Warnings:

  - You are about to drop the column `title` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[occasion]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Made the column `occasion` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Event_title_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "title",
ALTER COLUMN "occasion" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Event_occasion_key" ON "Event"("occasion");
