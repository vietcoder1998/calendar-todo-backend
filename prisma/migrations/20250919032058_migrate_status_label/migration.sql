/*
  Warnings:

  - You are about to alter the column `status` on the `todo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Made the column `status` on table `linkeditem` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `label` to the `todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `asset` ADD COLUMN `config` JSON NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `assettype` ADD COLUMN `config` JSON NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `fileitem` ADD COLUMN `config` JSON NULL,
    ADD COLUMN `label` VARCHAR(191) NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `gantttask` ADD COLUMN `config` JSON NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `history` ADD COLUMN `config` JSON NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `linkeditem` ADD COLUMN `config` JSON NULL,
    ADD COLUMN `label` VARCHAR(191) NULL,
    MODIFY `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `location` ADD COLUMN `config` JSON NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `permission` ADD COLUMN `config` JSON NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `config` JSON NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `todo` ADD COLUMN `config` JSON NULL,
    ADD COLUMN `label` VARCHAR(191) NOT NULL,
    MODIFY `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `config` JSON NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `webhook` ADD COLUMN `config` JSON NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;
