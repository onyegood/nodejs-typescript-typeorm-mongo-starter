import { AppDataSource } from "@/database/data-source";
import { User } from "@/database/entity/User";

export const UserRepository = AppDataSource.getMongoRepository(User);
