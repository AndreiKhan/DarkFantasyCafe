-- CreateEnum
CREATE TYPE "NewsType" AS ENUM ('NEWS', 'PERFORMANCE', 'MONSTER');

-- CreateEnum
CREATE TYPE "NewsStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "NewsType" NOT NULL DEFAULT 'NEWS',
    "status" "NewsStatus" NOT NULL DEFAULT 'DRAFT',
    "titleRu" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "shortDescriptionRu" TEXT NOT NULL,
    "shortDescriptionEn" TEXT NOT NULL,
    "bodyRu" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "images" TEXT[],
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");
