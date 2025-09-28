-- AlterTable
ALTER TABLE `fileitem` ADD COLUMN `reportId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `gantttask` ADD COLUMN `reportId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `todo` ADD COLUMN `reportId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `report` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `report`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fileitem` ADD CONSTRAINT `fileitem_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `report`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gantttask` ADD CONSTRAINT `gantttask_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `report`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `report` ADD CONSTRAINT `report_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
