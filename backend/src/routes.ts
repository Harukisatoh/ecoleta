import express from 'express';

import LocationsController from './controllers/LocationsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();

const locationsController = new LocationsController();
const itemsController = new ItemsController();

routes.post('/locations', locationsController.create);
routes.get('/locations', locationsController.index);
routes.get('/locations/:id', locationsController.show);

routes.get('/items', itemsController.index);

export default routes;

// Common names for controller functions
// index, show, create, update, delete

// Service pattern
// Repository pattern