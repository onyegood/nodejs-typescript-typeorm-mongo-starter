import { User } from '@/database/entity/User';
import { UserRepository } from '@/repositories/UsersRepository';
import { ObjectId } from 'mongodb';

export class UserService {
  public async getAllUsers(options: any): Promise<User[]> {
    return await UserRepository.find(options);
  }

  public async getUserById(id: string): Promise<User | null> {
    return await UserRepository.findOneByOrFail({ _id: new ObjectId(id) });
  }

  public async currentUser(id: string): Promise<User> {
    return await UserRepository.findOneByOrFail({ _id: new ObjectId(id) });
  }

  public async create(user: Partial<User>): Promise<User> {
    const payload = UserRepository.create(user);
    return await UserRepository.save(payload);
  }

  public async update(id: string, user: Partial<User>): Promise<User | null> {
    const userExist = await this.getUserById(id);
    if (!userExist) return null;

    Object.assign(userExist, user);
    return await UserRepository.save(userExist);
  }

  public async delete(id: string): Promise<boolean> {
    const _id = new ObjectId(id);
    const result = await UserRepository.delete(_id);
    return result.affected ? true : false;
  }
}
