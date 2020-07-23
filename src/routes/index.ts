import { Router } from 'express';

import itemsRouter from './items.routes';
import usersRouter from './users.routes';

const routes = Router();

routes.use('/items', itemsRouter);
routes.use('/users', usersRouter);

export default routes;
