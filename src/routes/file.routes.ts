import { Router } from 'express';
import * as fileController from '../controllers/file.controller';
import { validateFile } from '../middlewares/file.middleware';

const router = Router();

router.get('/', fileController.getFiles);
router.post('/', validateFile, fileController.createFile);
router.put('/:id', validateFile, fileController.updateFile);
router.delete('/:id', fileController.deleteFile);

export default router;
