/*
  Warnings:

  - You are about to drop the column `config` on the `asset` table. All the data in the column will be lost.
  - You are about to drop the column `config` on the `assettype` table. All the data in the column will be lost.
  - You are about to drop the column `config` on the `fileitem` table. All the data in the column will be lost.
  - You are about to drop the column `config` on the `gantttask` table. All the data in the column will be lost.
  - You are about to drop the column `config` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `config` on the `location` table. All the data in the column will be lost.
  - You are about to drop the column `config` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the column `config` on the `todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `asset` DROP COLUMN `config`;

-- AlterTable
ALTER TABLE `assettype` DROP COLUMN `config`;

-- AlterTable
ALTER TABLE `fileitem` DROP COLUMN `config`;

-- AlterTable
ALTER TABLE `gantttask` DROP COLUMN `config`;

-- AlterTable
ALTER TABLE `history` DROP COLUMN `config`;

-- AlterTable
ALTER TABLE `location` DROP COLUMN `config`;

-- AlterTable
ALTER TABLE `permission` DROP COLUMN `config`;

-- AlterTable
ALTER TABLE `todo` DROP COLUMN `config`;
