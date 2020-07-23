import { Router } from 'express';
import { getRepository } from 'typeorm';

import CreateItemsService from '../services/CreateItemsService';
import Item from '../models/Item';

const itemsRouter = Router();

itemsRouter.get('/', async (request, response) => {
  const itemsRepository = getRepository(Item);

  const items = await itemsRepository.find();
  return response.json(items);
});

itemsRouter.post('/', async (request, response) => {
  const { name, price } = request.body;

  const createItemsService = new CreateItemsService();

  const item = await createItemsService.execute({
    name,
    price,
  });

  return response.json(item);
});

itemsRouter.put('/', async (request, response) => {
  return response.json({ item: 'put' });
});

itemsRouter.delete('/', async (request, response) => {
  return response.json({ item: 'delete' });
});

export default itemsRouter;
