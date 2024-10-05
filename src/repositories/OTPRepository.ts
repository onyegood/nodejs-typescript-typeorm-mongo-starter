import { AppDataSource } from "@/database/data-source";
import { Otp } from "@/database/entity/Otp";

export const OtpRepository = AppDataSource.getMongoRepository(Otp);
