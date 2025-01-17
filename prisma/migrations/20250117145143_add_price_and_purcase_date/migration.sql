-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "estimatedValue" DOUBLE PRECISION,
ADD COLUMN     "purchaseDate" TIMESTAMP(3),
ADD COLUMN     "purchasePrice" DOUBLE PRECISION,
ADD COLUMN     "sellPrice" DOUBLE PRECISION;
