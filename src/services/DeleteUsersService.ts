import { getRepository } from 'typeorm';

import User from '../models/User';

class DeleteUsersService {
  public async execute(user_id: string): Promise<void> {
    const usersRepository = getRepository(User);

    const userExists = await usersRepository.findOne(user_id);

    if (!userExists) {
      throw new Error('User does not exist');
    }

    await usersRepository.remove(userExists);
  }
}

export default DeleteUsersService;
