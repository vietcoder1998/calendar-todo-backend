import { Router } from 'express';
import * as fileController from '../controllers/file.controller';
import * as historyController from '../controllers/history.controller';
import * as linkedItemController from '../controllers/linkedItem.controller';
import * as locationController from '../controllers/location.controller';
import * as permissionController from '../controllers/permission.controller';
import * as projectController from '../controllers/project.controller';
import * as userController from '../controllers/user.controller';
import * as webhookController from '../controllers/webhook.controller';
import { validateProject } from '../middlewares/project.middleware';

const router = Router();

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.get('/:id/users', userController.getUsersByProjectId);
router.get('/:id/linked-items', linkedItemController.getLinkedItems);
router.get('/:id/files', fileController.getFiles);
router.get('/:id/permissions', permissionController.getPermissions);
router.get('/:id/webhooks', webhookController.getWebhooks);
router.get('/:id/histories', historyController.getHistories);
router.get('/:id/locations', locationController.getLocations);

router.post('/', validateProject, projectController.createProject);
router.put('/:id', validateProject, projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
