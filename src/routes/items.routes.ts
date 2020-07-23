import { Router } from 'express';
import { getRepository } from 'typeorm';

import Item from '../models/Item';

import CreateItemsService from '../services/CreateItemsService';
import DeleteItemsService from '../services/DeleteItemsService';
import UpdateItemsService from '../services/UpdateItemsService';

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

itemsRouter.put('/:item_id', async (request, response) => {
  const { item_id } = request.params;
  const { name, price } = request.body;
  try {
    const updateItemsService = new UpdateItemsService();

    const itemUpdated = await updateItemsService.execute({
      item_id,
      name,
      price,
    });

    return response.json(itemUpdated);
  } catch (err) {
    return response.status(400).json({ message: err.message });
  }
});

itemsRouter.delete('/:item_id', async (request, response) => {
  const { item_id } = request.params;
  try {
    const deleteItemsService = new DeleteItemsService();

    await deleteItemsService.execute(item_id);

    return response.status(204).json();
  } catch (err) {
    return response.status(400).json({ message: err.message });
  }
});

export default itemsRouter;
