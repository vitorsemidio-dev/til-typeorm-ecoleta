import { uuid } from 'uuidv4';
import { Connection, getConnection } from 'typeorm';

import createConnection from '../database';

import CreateItemsService from './CreateItemsService';
import UpdateItemsService from './UpdateItemsService';

const connectionName = 'default';

let connection: Connection;

let createItemsService: CreateItemsService;
let updateItemsService: UpdateItemsService;

describe('Update Items Service', () => {
  beforeAll(async () => {
    connection = await createConnection(connectionName);

    await connection.query('DROP TABLE IF EXISTS items');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM users');

    createItemsService = new CreateItemsService();
    updateItemsService = new UpdateItemsService();
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to update an item', async () => {
    const item = await createItemsService.execute({
      name: 'Item do Test',
      price: 1,
    });

    const itemUpdated = await updateItemsService.execute({
      item_id: item.id,
      name: 'Item do Test atualizado',
      price: 20,
    });

    expect(itemUpdated.id).toEqual(item.id);
    expect(itemUpdated).toMatchObject({
      name: 'Item do Test atualizado',
      price: 20,
    });
  });

  it('should not be able to update a non-existing item', async () => {
    const itemId = uuid();

    await expect(
      updateItemsService.execute({
        item_id: itemId,
        name: 'Non-existing item',
        price: 20,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to update an item with a negative price', async () => {
    // TODO: Test Red
    const item = await createItemsService.execute({
      name: 'Item do Test',
      price: 1,
    });

    await expect(
      updateItemsService.execute({
        item_id: item.id,
        name: 'Item do Test com preço negativo',
        price: -50,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
