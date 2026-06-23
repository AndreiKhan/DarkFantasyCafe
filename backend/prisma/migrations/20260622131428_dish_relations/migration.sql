/*
  Warnings:

  - You are about to drop the column `category` on the `Dish` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Dish` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Dish` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Dish` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Dish` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Dish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionEn` to the `Dish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptionRu` to the `Dish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `Dish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameRu` to the `Dish` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dish" DROP COLUMN "category",
DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "tags",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "descriptionEn" TEXT NOT NULL,
ADD COLUMN     "descriptionRu" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "nameRu" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allergen" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,

    CONSTRAINT "Allergen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DishTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DishTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DishAllergens" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DishAllergens_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Allergen_slug_key" ON "Allergen"("slug");

-- CreateIndex
CREATE INDEX "_DishTags_B_index" ON "_DishTags"("B");

-- CreateIndex
CREATE INDEX "_DishAllergens_B_index" ON "_DishAllergens"("B");

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DishTags" ADD CONSTRAINT "_DishTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DishTags" ADD CONSTRAINT "_DishTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DishAllergens" ADD CONSTRAINT "_DishAllergens_A_fkey" FOREIGN KEY ("A") REFERENCES "Allergen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DishAllergens" ADD CONSTRAINT "_DishAllergens_B_fkey" FOREIGN KEY ("B") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;
