import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Item from '../models/Item';

import CreateItemsService from '../services/CreateItemsService';
import DeleteItemsService from '../services/DeleteItemsService';
import UpdateItemsService from '../services/UpdateItemsService';

class ItemsController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, price } = request.body;

      const createItemsService = new CreateItemsService();

      const item = await createItemsService.execute({ name, price });

      return response.json(item);
    } catch (err) {
      return response.status(400).json({ message: err.message });
    }
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    try {
      const { item_id } = request.params;

      const deleteItemsService = new DeleteItemsService();

      await deleteItemsService.execute(item_id);

      return response.status(204).json();
    } catch (err) {
      return response.status(400).json({ message: err.message });
    }
  }

  public async index(resquest: Request, response: Response): Promise<Response> {
    try {
      const itemsRepository = getRepository(Item);

      const items = await itemsRepository.find();

      return response.json(items);
    } catch (err) {
      return response.status(400).json({ message: err.message });
    }
  }

  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const { item_id } = request.params;
      const { name, price } = request.body;

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
  }
}

export default ItemsController;
