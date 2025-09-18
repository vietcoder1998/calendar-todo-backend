-- AlterTable
ALTER TABLE `permission` ADD COLUMN `assetId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `permission` ADD CONSTRAINT `permission_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
