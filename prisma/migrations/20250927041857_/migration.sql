-- AlterTable
ALTER TABLE `asset` ADD COLUMN `position` INTEGER NULL;

-- AlterTable
ALTER TABLE `fileitem` ADD COLUMN `position` INTEGER NULL;

-- AlterTable
ALTER TABLE `label` ADD COLUMN `position` INTEGER NULL;

-- AlterTable
ALTER TABLE `linkeditem` ADD COLUMN `position` INTEGER NULL;

-- AlterTable
ALTER TABLE `location` ADD COLUMN `position` INTEGER NULL;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `position` INTEGER NULL;

-- AlterTable
ALTER TABLE `notificationtemplate` ADD COLUMN `position` INTEGER NULL;

-- AlterTable
ALTER TABLE `report` ADD COLUMN `position` INTEGER NULL;

-- AlterTable
ALTER TABLE `role` ADD COLUMN `position` INTEGER NULL;

-- AlterTable
ALTER TABLE `todo` ADD COLUMN `position` INTEGER NULL;
