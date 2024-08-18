import { User } from "@/database/entity/User";
import { UserRepository } from "@/repositories/UsersRepository";

export class AuthService {
  public async login(email: string): Promise<User | null> {
    return await UserRepository.findOneByOrFail({ email });
  }
}
