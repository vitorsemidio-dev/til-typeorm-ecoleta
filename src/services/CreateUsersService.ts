import { getRepository } from 'typeorm';

import User from '../models/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUsersService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const usersRepository = getRepository(User);

    if (!name || !email || !password) {
      throw new Error('Missing information to create a new user');
    }

    const regex = new RegExp(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i);

    if (!regex.test(email)) {
      throw new Error('Invalid e-mail');
    }

    const checkEmail = await usersRepository.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      throw new Error('E-mail already used');
    }

    const user = usersRepository.create({
      name,
      email,
      password,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUsersService;
