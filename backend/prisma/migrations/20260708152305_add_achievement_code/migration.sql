/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Achievements` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Achievements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Achievements" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Achievements_code_key" ON "Achievements"("code");
