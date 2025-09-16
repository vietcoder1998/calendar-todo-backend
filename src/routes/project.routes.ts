import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { validateProject } from '../middlewares/project.middleware';

const router = Router();

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', validateProject, projectController.createProject);
router.put('/:id', validateProject, projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
