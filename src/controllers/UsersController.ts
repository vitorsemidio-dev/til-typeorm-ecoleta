import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';

import CreateUsersService from '../services/CreateUsersService';
import DeleteUsersService from '../services/DeleteUsersService';
import UpdateUsersService from '../services/UpdateUsersService';

class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password } = request.body;
      const createUsersService = new CreateUsersService();

      const user = await createUsersService.execute({ name, email, password });

      return response.json(user);
    } catch (err) {
      return response.status(400).json({ message: err.message });
    }
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    try {
      const { user_id } = request.params;

      const deleteUsersService = new DeleteUsersService();

      await deleteUsersService.execute(user_id);

      return response.status(204).json();
    } catch (err) {
      return response.status(400).json({ message: err.message });
    }
  }

  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const usersRepository = getRepository(User);

      const users = await usersRepository.find();

      return response.json(users);
    } catch (err) {
      return response.status(400).json({ message: err.message });
    }
  }

  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const { user_id } = request.params;
      const { name, email, password } = request.body;

      const updateUsersService = new UpdateUsersService();

      const userUpdated = await updateUsersService.execute({
        user_id,
        name,
        email,
        password,
      });

      return response.json(userUpdated);
    } catch (err) {
      return response.status(400).json({ message: err.message });
    }
  }
}

export default UsersController;
