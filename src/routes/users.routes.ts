import { Router } from 'express';

const usersRouter = Router();

usersRouter.get('/', (request, response) =>
  response.json({
    users: true,
  }),
);

export default usersRouter;
