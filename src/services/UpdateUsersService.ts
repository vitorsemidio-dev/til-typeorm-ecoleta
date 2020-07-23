import { getRepository } from 'typeorm';

import User from '../models/User';

interface IRequest {
  user_id: string;
  name: string;
  password: string;
  email: string;
}

class UpdateUsersService {
  public async execute({
    name,
    password,
    email,
    user_id,
  }: IRequest): Promise<User> {
    const usersRepository = getRepository(User);

    const userExists = await usersRepository.findOne(user_id);

    if (!userExists) {
      throw new Error('User does not exist');
    }

    const userUpdated = { ...userExists, name, password, email };

    await usersRepository.save(userUpdated);

    return userUpdated;
  }
}

export default UpdateUsersService;
