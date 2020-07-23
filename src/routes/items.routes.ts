import { Router } from 'express';

import ItemsController from '../controllers/ItemsController';

const itemsRouter = Router();

const itemsController = new ItemsController();

itemsRouter.get('/', itemsController.index);

itemsRouter.post('/', itemsController.create);

itemsRouter.put('/:item_id', itemsController.update);

itemsRouter.delete('/:item_id', itemsController.delete);

export default itemsRouter;
