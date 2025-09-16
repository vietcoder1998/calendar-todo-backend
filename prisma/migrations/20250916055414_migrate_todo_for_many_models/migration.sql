/*
  Warnings:

  - You are about to alter the column `relatedTaskIds` on the `Todo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `assignedUsers` on the `Todo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `files` on the `Todo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `webhooks` on the `Todo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - You are about to alter the column `ganttTaskIds` on the `Todo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Todo` MODIFY `relatedTaskIds` JSON NULL,
    MODIFY `assignedUsers` JSON NULL,
    MODIFY `files` JSON NULL,
    MODIFY `webhooks` JSON NULL,
    MODIFY `ganttTaskIds` JSON NULL;
