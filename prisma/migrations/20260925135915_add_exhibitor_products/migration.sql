-- CreateTable
CREATE TABLE "ExhibitorProduct" (
    "id" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "productType" TEXT,
    "productImage" TEXT,
    "specialType" TEXT,
    "showId" INTEGER NOT NULL,
    "exhibitorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExhibitorProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExhibitorProduct_exhibitorId_idx" ON "ExhibitorProduct"("exhibitorId");

-- CreateIndex
CREATE INDEX "ExhibitorProduct_showId_idx" ON "ExhibitorProduct"("showId");

-- AddForeignKey
ALTER TABLE "ExhibitorProduct" ADD CONSTRAINT "ExhibitorProduct_exhibitorId_fkey" FOREIGN KEY ("exhibitorId") REFERENCES "Exhibitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
