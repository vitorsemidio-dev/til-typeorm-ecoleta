import { getRepository } from 'typeorm';

import Item from '../models/Item';

interface IRequest {
  name: string;
  price: number;
}

class CreateItemsService {
  public async execute({ name, price }: IRequest): Promise<Item> {
    const itemsRepository = getRepository(Item);

    if (price < 0) {
      throw new Error('Negative price');
    }

    const item = itemsRepository.create({
      name,
      price,
    });

    await itemsRepository.save(item);

    return item;
  }
}

export default CreateItemsService;
