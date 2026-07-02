-- CreateEnum
CREATE TYPE "achievementRarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "achievementStatus" AS ENUM ('ARCHIVED', 'PUBLISHED', 'DRAFT');

-- CreateEnum
CREATE TYPE "MasterSessionType" AS ENUM ('ONESHOT', 'CAMPAIGN');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MASTER';

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "masterId" TEXT,
ADD COLUMN     "masterSessionType" "MasterSessionType";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "bonuses" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "bio" TEXT,
    "class" TEXT NOT NULL,
    "subclass" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "strength" INTEGER NOT NULL,
    "dexterity" INTEGER NOT NULL,
    "constitution" INTEGER NOT NULL,
    "intelligence" INTEGER NOT NULL,
    "wisdom" INTEGER NOT NULL,
    "charisma" INTEGER NOT NULL,
    "inventory" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievements" (
    "id" TEXT NOT NULL,
    "status" "achievementStatus" NOT NULL DEFAULT 'DRAFT',
    "nameRu" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "howToGetEn" TEXT NOT NULL,
    "howToGetRu" TEXT NOT NULL,
    "bonuses" INTEGER NOT NULL,
    "rarity" "achievementRarity"[],

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AchievementsToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AchievementsToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AchievementsToUser_B_index" ON "_AchievementsToUser"("B");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AchievementsToUser" ADD CONSTRAINT "_AchievementsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AchievementsToUser" ADD CONSTRAINT "_AchievementsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
