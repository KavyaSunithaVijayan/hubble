/*
  Warnings:

  - The primary key for the `Exhibitor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `boothNumber` on the `Exhibitor` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Exhibitor` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Exhibitor` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Exhibitor` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Exhibitor` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `Exhibitor` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Exhibitor` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Exhibitor` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Exhibitor` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Exhibitor` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `Exhibitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `showId` to the `Exhibitor` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Exhibitor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Exhibitor_category_idx";

-- DropIndex
DROP INDEX "Exhibitor_slug_key";

-- AlterTable
ALTER TABLE "Exhibitor" DROP CONSTRAINT "Exhibitor_pkey",
DROP COLUMN "boothNumber",
DROP COLUMN "category",
DROP COLUMN "country",
DROP COLUMN "description",
DROP COLUMN "email",
DROP COLUMN "logoUrl",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "slug",
DROP COLUMN "website",
ADD COLUMN     "boothNo" TEXT,
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "countryId" INTEGER,
ADD COLUMN     "hallNo" TEXT,
ADD COLUMN     "showId" INTEGER NOT NULL,
ADD COLUMN     "squareLogo" TEXT,
ADD COLUMN     "userId" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Exhibitor_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Show" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE INDEX "Exhibitor_showId_idx" ON "Exhibitor"("showId");

-- CreateIndex
CREATE INDEX "Exhibitor_countryId_idx" ON "Exhibitor"("countryId");

-- AddForeignKey
ALTER TABLE "Exhibitor" ADD CONSTRAINT "Exhibitor_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exhibitor" ADD CONSTRAINT "Exhibitor_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
