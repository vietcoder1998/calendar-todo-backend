/*
  Warnings:

  - You are about to drop the column `end` on the `gantttask` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `gantttask` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `gantttask` DROP COLUMN `end`,
    DROP COLUMN `start`,
    ADD COLUMN `label` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `notificationtemplate` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `label` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `label` ADD CONSTRAINT `label_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
