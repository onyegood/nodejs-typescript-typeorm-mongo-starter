import { AppDataSource } from "@/database/data-source";
import { Otp } from "@/database/entity/OTP";

export const OtpRepository = AppDataSource.getMongoRepository(Otp);
