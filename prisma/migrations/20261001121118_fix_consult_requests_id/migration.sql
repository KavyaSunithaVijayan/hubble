/*
  Warnings:

  - The primary key for the `consult_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `consult_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "consult_requests" DROP CONSTRAINT "consult_requests_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "consult_requests_pkey" PRIMARY KEY ("id");
