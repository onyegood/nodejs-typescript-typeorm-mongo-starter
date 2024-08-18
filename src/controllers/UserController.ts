import { Request, Response } from 'express';
import { UserService } from '@/services/UserService';
import { UserRepository } from '@/repositories/UsersRepository';

const userService = new UserService();

export class UserController {
  public async getAllUsers(req: Request, res: Response): Promise<Response> {
    let options = {};

    if (req.query.s) {
      options = {
        ...options,
        where: {
          $or: [
            { firstName: new RegExp(req.query.s.toString(), 'i') },
            { lastName: new RegExp(req.query.s.toString(), 'i') },
          ],
        },
      };
    }

    if (req.query.sort) {
      options = {
        ...options,
        order: {
          firstName: req.query.sort.toString().toUpperCase(),
          lastName: req.query.sort.toString().toUpperCase(),
          gender: req.query.sort.toString().toUpperCase(),
        },
      };
    }

    // Pagination
    const page: number = parseInt(req.query.page as any) || 1;
    const take: number = parseInt(req.query.take as any) || 5;
    const total = await UserRepository.count();

    const users = await userService.getAllUsers({
      ...options,
      take,
      skip: (page - 1) * take,
    });
    return res
      .status(200)
      .json({ users, total, page, last_page: Math.ceil(total / take) });
  }

  public async getUserById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    console.log(user);

    return user
      ? res.status(200).json(user)
      : res.status(404).json({ message: 'User not found' });
  }

  public async getCurrentUser(req: Request, res: Response): Promise<Response> {
    const id = req['user']['id'];

    const user = await userService.getUserById(id);
    return user
      ? res.status(200).json(user)
      : res.status(404).json({ message: 'User not found' });
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    const user = await userService.create(req.body);
    return res.status(201).json(user);
  }

  public async updateUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const user = await userService.update(id, req.body);
    return user
      ? res.status(200).json(user)
      : res.status(404).json({ message: 'User not found' });
  }

  public async deleteUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleted = await userService.delete(id);
    return deleted
      ? res.status(200).json({ message: 'Deleted' })
      : res.status(404).json({ message: 'User not found' });
  }
}
