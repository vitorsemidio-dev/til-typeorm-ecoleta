import { Connection, getConnection } from 'typeorm';

import CreateUsersService from './CreateUsersService';

const connectionName = 'default';

let connection: Connection;

let createUsersService: CreateUsersService;

describe('Create Users Service', () => {
  it('should be able to create a new user', async () => {
    // TODO
  });

  it('should not be able to create a new user with an email already registered', async () => {
    // TODO
  });
});
