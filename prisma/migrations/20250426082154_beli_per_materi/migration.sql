/*
  Warnings:

  - You are about to drop the column `harga` on the `Kelas` table. All the data in the column will be lost.
  - You are about to drop the column `kelasId` on the `PaymentItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,status]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `Materi` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `materiId` to the `PaymentItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('CART', 'PENDING', 'PAID', 'FAILED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentItem" DROP CONSTRAINT "PaymentItem_kelasId_fkey";

-- DropIndex
DROP INDEX "OneActivePayment";

-- AlterTable
ALTER TABLE "Kelas" DROP COLUMN "harga";

-- AlterTable
ALTER TABLE "Materi" ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL;

-- AlterTable
ALTER TABLE "PaymentItem" DROP COLUMN "kelasId",
ADD COLUMN     "materiId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OneActiveCartOrCheckout" ON "Payment"("userId", "status");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentItem" ADD CONSTRAINT "PaymentItem_materiId_fkey" FOREIGN KEY ("materiId") REFERENCES "Materi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
