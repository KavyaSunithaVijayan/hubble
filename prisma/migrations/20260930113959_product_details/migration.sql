/*
  Warnings:

  - You are about to drop the `ConsultRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ConsultRequest";

-- CreateTable
CREATE TABLE "consult_requests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consult_requests_pkey" PRIMARY KEY ("id")
);
