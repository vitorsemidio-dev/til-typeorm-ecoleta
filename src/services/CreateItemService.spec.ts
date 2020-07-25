import {
  Connection,
  getConnection,
  getRepository,
  getConnectionOptions,
} from 'typeorm';

import Item from '../models/Item';

describe('Create Item', () => {
  it('should be able to create a new item', async () => {
    // TODO
    // const itemsRepository = getRepository(Item);
    const defaultOptions = await getConnectionOptions();

    console.log(process.env.NODE_ENV);
    console.log(defaultOptions);
  });
});
