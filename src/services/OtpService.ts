import { ObjectId } from "typeorm";

import { Otp } from "@/database/entity/OTP";
import { OtpRepository } from "@/repositories/OTPRepository";

export class OtpService {
  public async create(otp: {
    email: string;
    code: string;
    token: string;
  }): Promise<Otp | null> {
    const payload = OtpRepository.create(otp);
    return await OtpRepository.save(payload);
    // const isEmailExisting = await OtpRepository.findOneByOrFail({
    //   email: new ObjectId(otp.email),
    // });

    // if (!isEmailExisting) {
    //   const payload = OtpRepository.create(otp);
    //   return await OtpRepository.save(payload);
    // }
    // Object.assign(isEmailExisting, otp);
    // return await OtpRepository.save(isEmailExisting);
  }

  public async delete(id: string): Promise<boolean> {
    const _id = new ObjectId(id);
    const result = await OtpRepository.delete(_id);
    return result.affected ? true : false;
  }
}
