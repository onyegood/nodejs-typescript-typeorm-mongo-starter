import { Otp } from "@/database/entity/OTP";
import { OtpRepository } from "@/repositories/OTPRepository";

export class OtpService {
  public async create(otp: {
    email: string;
    code: string;
    token: string;
  }): Promise<Otp | null> {
    const isEmailExisting = await OtpRepository.findOneByOrFail({
      email: otp.email,
    });

    // If otp with that email address exists delete the record before creating new one.
    if (isEmailExisting) {
      await this.delete(otp.email);
    }

    const payload = OtpRepository.create(otp);
    return await OtpRepository.save(payload);
  }

  public async delete(email: string): Promise<boolean> {
    const result = await OtpRepository.delete({ email });
    return result.affected ? true : false;
  }
}
