-- AddForeignKey
ALTER TABLE `Todo` ADD CONSTRAINT `Todo_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
