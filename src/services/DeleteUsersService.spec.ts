import { Connection, getConnection } from 'typeorm';

import DeleteUsersService from './DeleteUsersService';

const connectionName = 'default';

let connection: Connection;

let deleteUsersService: DeleteUsersService;

describe('Delete Users Service', () => {
  it('should be able to delete an user', async () => {
    // TODO
  });

  it('should not be able to delete a non-existing user', async () => {
    // TODO
  });
});
