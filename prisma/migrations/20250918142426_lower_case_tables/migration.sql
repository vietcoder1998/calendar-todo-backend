/*
  Warnings:

  - You are about to drop the `Asset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssetType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GanttTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `History` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LinkedItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Todo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Webhook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Asset` DROP FOREIGN KEY `Asset_typeId_fkey`;

-- DropForeignKey
ALTER TABLE `FileItem` DROP FOREIGN KEY `FileItem_assetId_fkey`;

-- DropForeignKey
ALTER TABLE `FileItem` DROP FOREIGN KEY `FileItem_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `GanttTask` DROP FOREIGN KEY `GanttTask_assetId_fkey`;

-- DropForeignKey
ALTER TABLE `GanttTask` DROP FOREIGN KEY `GanttTask_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `LinkedItem` DROP FOREIGN KEY `LinkedItem_assetId_fkey`;

-- DropForeignKey
ALTER TABLE `LinkedItem` DROP FOREIGN KEY `LinkedItem_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `Location` DROP FOREIGN KEY `Location_assetId_fkey`;

-- DropForeignKey
ALTER TABLE `Location` DROP FOREIGN KEY `Location_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `Permission` DROP FOREIGN KEY `Permission_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `Todo` DROP FOREIGN KEY `Todo_assetId_fkey`;

-- DropForeignKey
ALTER TABLE `Todo` DROP FOREIGN KEY `Todo_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `Webhook` DROP FOREIGN KEY `Webhook_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `_UserPermissions` DROP FOREIGN KEY `_UserPermissions_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserPermissions` DROP FOREIGN KEY `_UserPermissions_B_fkey`;

-- DropTable
DROP TABLE `Asset`;

-- DropTable
DROP TABLE `AssetType`;

-- DropTable
DROP TABLE `FileItem`;

-- DropTable
DROP TABLE `GanttTask`;

-- DropTable
DROP TABLE `History`;

-- DropTable
DROP TABLE `LinkedItem`;

-- DropTable
DROP TABLE `Location`;

-- DropTable
DROP TABLE `Permission`;

-- DropTable
DROP TABLE `Project`;

-- DropTable
DROP TABLE `Todo`;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `Webhook`;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT 'gmail',
    `email` VARCHAR(191) NOT NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `projectId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `todo` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `deadline` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` VARCHAR(191) NOT NULL,
    `updatedAt` VARCHAR(191) NOT NULL,
    `locationId` VARCHAR(191) NULL,
    `relatedTaskIds` JSON NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `history` JSON NULL,
    `linkedItems` JSON NULL,
    `assignedUsers` JSON NULL,
    `files` JSON NULL,
    `webhooks` JSON NULL,
    `ganttTaskIds` JSON NULL,
    `assetId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fileitem` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,
    `createdAt` VARCHAR(191) NULL,
    `updatedAt` VARCHAR(191) NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `assetId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `resource` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `linkeditem` (
    `id` VARCHAR(191) NOT NULL,
    `todoId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `url` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL,
    `createdAt` VARCHAR(191) NOT NULL,
    `updatedAt` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `assetId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gantttask` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `start` VARCHAR(191) NULL,
    `end` VARCHAR(191) NULL,
    `createdAt` VARCHAR(191) NULL,
    `updatedAt` VARCHAR(191) NULL,
    `startDate` VARCHAR(191) NULL,
    `endDate` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `assetId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `webhook` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NULL,
    `chatId` VARCHAR(191) NULL,
    `webhookUrl` VARCHAR(191) NULL,
    `enabled` BOOLEAN NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `avatarUrl` TEXT NULL,
    `plan` VARCHAR(191) NULL,
    `members` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history` (
    `id` VARCHAR(191) NOT NULL,
    `changes` JSON NULL,
    `date` DATETIME(3) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `payload` JSON NULL,
    `timestamp` VARCHAR(191) NOT NULL,
    `user` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assettype` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `assettype_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `typeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `googleMapsLink` VARCHAR(191) NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `assetId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fileitem` ADD CONSTRAINT `fileitem_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fileitem` ADD CONSTRAINT `fileitem_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permission` ADD CONSTRAINT `permission_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `linkeditem` ADD CONSTRAINT `linkeditem_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `linkeditem` ADD CONSTRAINT `linkeditem_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gantttask` ADD CONSTRAINT `gantttask_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gantttask` ADD CONSTRAINT `gantttask_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webhook` ADD CONSTRAINT `webhook_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `asset_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `assettype`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserPermissions` ADD CONSTRAINT `_UserPermissions_A_fkey` FOREIGN KEY (`A`) REFERENCES `permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserPermissions` ADD CONSTRAINT `_UserPermissions_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
