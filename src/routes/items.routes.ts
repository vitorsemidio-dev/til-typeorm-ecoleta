import { Router } from 'express';
import { getRepository } from 'typeorm';

import Item from '../models/Item';

const itemsRouter = Router();

itemsRouter.get('/', async (request, response) => {
  const itemsRepository = getRepository(Item);

  const items = await itemsRepository.find();
  return response.json(items);
});

export default itemsRouter;
