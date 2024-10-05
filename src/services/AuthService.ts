import { ObjectId } from "mongodb";

import { User } from "@/database/entity/User";
import { UserRepository } from "@/repositories/UsersRepository";

export class AuthService {
  public async login(email: string): Promise<User | null> {
    return await UserRepository.findOneByOrFail({ email });
  }

  public async sendOTP(email: string): Promise<User | null> {
    return await UserRepository.findOneByOrFail({ email });
  }

  public async resetPassword(id: string, password: string): Promise<boolean> {
    const user = await UserRepository.findOneByOrFail({
      _id: new ObjectId(id),
    });

    if (!user) return false;

    const hasUpdated = await UserRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { password } },
    );

    return hasUpdated ? true : false;
  }

  public async verifyUser(id: string): Promise<boolean> {
    const user = await UserRepository.findOneByOrFail({
      _id: new ObjectId(id),
    });

    if (!user) return false;

    const hasUpdated = await UserRepository.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { verified: true } },
    );

    return hasUpdated ? true : false;
  }
}
