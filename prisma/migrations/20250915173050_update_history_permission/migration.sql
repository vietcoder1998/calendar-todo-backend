/*
  Warnings:

  - You are about to drop the column `name` on the `Permission` table. All the data in the column will be lost.
  - Added the required column `projecId` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `Permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Permission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Permission` DROP COLUMN `name`,
    ADD COLUMN `projecId` VARCHAR(191) NOT NULL,
    ADD COLUMN `resource` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `History` (
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
