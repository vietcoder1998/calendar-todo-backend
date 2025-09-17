import router from './project.routes';
import * as locationController from '../controllers/location.controller';

// Location CRUD (by projectId)
router.get('/:id/locations', locationController.getLocations); // index by projectId
router.post('/:id/locations', locationController.createLocation); // create location for project
router.get('/:id/locations/:locationId', locationController.getLocationById); // get single location by id & projectId
router.put('/:id/locations/:locationId', locationController.updateLocation); // update location by id & projectId
router.delete('/:id/locations/:locationId', locationController.deleteLocation); // delete location by id & projectId
