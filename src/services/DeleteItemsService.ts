import { getRepository } from 'typeorm';

import Item from '../models/Item';

class DeleteItemsService {
  public async execute(item_id: string): Promise<void> {
    const itemsRepository = getRepository(Item);

    const itemExists = await itemsRepository.findOne(item_id);

    if (!itemExists) {
      throw new Error('Item does not exists');
    }

    await itemsRepository.remove(itemExists);
  }
}

export default DeleteItemsService;
