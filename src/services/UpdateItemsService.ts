import { getRepository } from 'typeorm';

import Item from '../models/Item';

interface IRequest {
  item_id: string;
  name: string;
  price: number;
}

class UpdateItemsService {
  public async execute({ item_id, name, price }: IRequest): Promise<Item> {
    const itemsRepository = getRepository(Item);

    const itemExists = await itemsRepository.findOne(item_id);

    if (!itemExists) {
      throw new Error('Item does not exists');
    }

    if (price < 0) {
      throw new Error('Negative price');
    }

    const itemUpdated = { ...itemExists, name, price };

    await itemsRepository.save(itemUpdated);

    return itemUpdated;
  }
}

export default UpdateItemsService;
