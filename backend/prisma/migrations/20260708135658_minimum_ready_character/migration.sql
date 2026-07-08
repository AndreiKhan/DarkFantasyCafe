/*
  Warnings:

  - Added the required column `alignment` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `background` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "alignment" TEXT NOT NULL,
ADD COLUMN     "appearance" TEXT,
ADD COLUMN     "armorClass" INTEGER,
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "background" TEXT NOT NULL,
ADD COLUMN     "equipment" TEXT[],
ADD COLUMN     "hitPoints" INTEGER,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "speed" INTEGER,
ADD COLUMN     "spells" TEXT[],
ADD COLUMN     "subrace" TEXT,
ALTER COLUMN "subclass" DROP NOT NULL;
