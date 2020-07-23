import { Router } from 'express';

import UsersController from '../controllers/UsersController';

const usersRouter = Router();

const usersController = new UsersController();

usersRouter.get('/', usersController.index);

usersRouter.post('/', usersController.create);

usersRouter.put('/:user_id', usersController.update);

usersRouter.delete('/:user_id', usersController.delete);

export default usersRouter;
