/*
  Warnings:

  - You are about to drop the column `config` on the `linkeditem` table. All the data in the column will be lost.
  - You are about to drop the column `config` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `config` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `config` on the `webhook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `linkeditem` DROP COLUMN `config`;

-- AlterTable
ALTER TABLE `project` DROP COLUMN `config`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `config`;

-- AlterTable
ALTER TABLE `webhook` DROP COLUMN `config`;
