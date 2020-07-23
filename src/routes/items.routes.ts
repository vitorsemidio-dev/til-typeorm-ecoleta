import { Router } from 'express';
import { getRepository } from 'typeorm';

import DeleteItemsService from '../services/DeleteItemsService';
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

itemsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const deleteItemsService = new DeleteItemsService();

    await deleteItemsService.execute(id);

    return response.status(204).json();
  } catch (err) {
    return response.status(400).json({ message: err.message });
  }
});

export default itemsRouter;
