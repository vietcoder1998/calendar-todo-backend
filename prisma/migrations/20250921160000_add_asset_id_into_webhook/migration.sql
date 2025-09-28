-- AlterTable
ALTER TABLE `webhook` ADD COLUMN `assetId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `webhook` ADD CONSTRAINT `webhook_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
