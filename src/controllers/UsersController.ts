import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';

class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const usersRepository = getRepository(User);

    const users = await usersRepository.find();

    return response.json(users);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    return response.json();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    return response.json();
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    return response.json();
  }
}

export default UsersController;
