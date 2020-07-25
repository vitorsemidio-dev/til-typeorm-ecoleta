import { Connection, getConnection } from 'typeorm';

import UpdateItemsService from './UpdateItemsService';

const connectionName = 'default';

let connection: Connection;

let updateItemsService: UpdateItemsService;

describe('Update Items Service', () => {
  it('should be able to update an item', async () => {
    // TODO
  });

  it('should not be able to update a non-existing item', async () => {
    // TODO
  });

  it('should not be able to update an item with a negative price', async () => {
    // TODO
  });
});
