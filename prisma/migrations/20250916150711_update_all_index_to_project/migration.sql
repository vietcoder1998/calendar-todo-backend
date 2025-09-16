/*
  Warnings:

  - Added the required column `projectId` to the `FileItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `GanttTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `LinkedItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Webhook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `FileItem` ADD COLUMN `projectId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `GanttTask` ADD COLUMN `projectId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `LinkedItem` ADD COLUMN `projectId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Webhook` ADD COLUMN `projectId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `FileItem` ADD CONSTRAINT `FileItem_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LinkedItem` ADD CONSTRAINT `LinkedItem_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GanttTask` ADD CONSTRAINT `GanttTask_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Webhook` ADD CONSTRAINT `Webhook_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
