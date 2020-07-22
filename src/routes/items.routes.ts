import { Router } from 'express';

const itemsRouter = Router();

itemsRouter.get('/', (request, response) =>
  response.json({
    items: true,
  }),
);

export default itemsRouter;
