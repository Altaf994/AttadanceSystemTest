/*
  Warnings:

  - You are about to drop the `PasswordReset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PasswordReset" DROP CONSTRAINT "PasswordReset_userId_fkey";

-- DropTable
DROP TABLE "PasswordReset";

-- DropTable
DROP TABLE "VerificationToken";
