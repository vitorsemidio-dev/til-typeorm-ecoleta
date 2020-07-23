import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Item from '../models/Item';

import CreateItemsService from '../services/CreateItemsService';
import DeleteItemsService from '../services/DeleteItemsService';
import UpdateItemsService from '../services/UpdateItemsService';

class ItemsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price } = request.body;

    const createItemsService = new CreateItemsService();

    const item = await createItemsService.execute({ name, price });

    return response.json(item);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { item_id } = request.params;

    const deleteItemsService = new DeleteItemsService();

    await deleteItemsService.execute(item_id);

    return response.status(204).json();
  }

  public async index(resquest: Request, response: Response): Promise<Response> {
    const itemsRepository = getRepository(Item);

    const items = await itemsRepository.find();

    return response.json(items);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { item_id } = request.params;
    const { name, price } = request.body;

    const updateItemsService = new UpdateItemsService();

    const itemUpdated = updateItemsService.execute({ item_id, name, price });

    return response.json(itemUpdated);
  }
}

export default ItemsController;
