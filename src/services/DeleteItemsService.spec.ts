import { uuid } from 'uuidv4';
import { Connection, getConnection } from 'typeorm';

import createConnection from '../database';

import CreateItemsService from './CreateItemsService';
import DeleteItemsService from './DeleteItemsService';

let connection: Connection;

const connectionName = 'default';

let createItemsService: CreateItemsService;
let deleteItemsService: DeleteItemsService;

describe('Delete Item', () => {
  beforeAll(async () => {
    connection = await createConnection(connectionName);

    await connection.query('DROP TABLE IF EXISTS items');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM items');

    createItemsService = new CreateItemsService();
    deleteItemsService = new DeleteItemsService();
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to delete an item', async () => {
    const { id } = await createItemsService.execute({
      name: 'Item do Test',
      price: 1,
    });

    await deleteItemsService.execute(id);

    await expect(deleteItemsService.execute(id)).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to delete a non-existing item', async () => {
    const itemId = uuid();

    await expect(deleteItemsService.execute(itemId)).rejects.toBeInstanceOf(
      Error,
    );
  });
});
