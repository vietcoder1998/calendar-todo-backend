import { Router } from 'express';
import * as assetController from '../controllers/asset.controller';

const router = Router();

router.get('/', assetController.getAssets);
router.get('/:id', assetController.getAssetById);
router.post('/', assetController.createAsset);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

export default router;
