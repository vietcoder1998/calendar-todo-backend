/*
  Warnings:

  - You are about to drop the column `projecId` on the `Permission` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Permission` DROP COLUMN `projecId`,
    ADD COLUMN `projectId` VARCHAR(191) NOT NULL;
