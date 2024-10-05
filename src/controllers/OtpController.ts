import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { UserType } from "@/constants/Roles";
import { STATUS_CODE } from "@/constants/StatusCode";
import { Mailer } from "@/mailler";
import { AuthService } from "@/services/AuthService";
import { OtpService } from "@/services/OtpService";
import { Generate } from "@/utils/Generate";
import { validateEmail } from "@/validation/user";

const otpService = new OtpService();
const authService = new AuthService();

export class OtpController {
  public async createOtp(req: Request, res: Response): Promise<Response> {
    try {
      const otp = await otpService.create(req.body);
      return res.status(STATUS_CODE.CONTENT_CREATED).json(otp);
    } catch (error: any) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  public async deleteOtp(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.body;

      const deleted = await otpService.delete(id);
      return deleted
        ? res.status(STATUS_CODE.SUCCESS).json({ message: "Deleted" })
        : res.status(STATUS_CODE.NOT_FOUND).json({ message: "OTP not found" });
    } catch (error: any) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  async sendOTP(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;

      // Validate the request
      await Promise.all(validateEmail.map(validation => validation.run(req)));
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
          .json({ errors: errors.array() });
      }

      // Validate data
      const user = await authService.sendOTP(email);

      if (!user) {
        return res
          .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "User not found" });
      }

      // Generate token
      const token = Generate.generateToken(
        String(user.id),
        String(UserType.PARENT),
        email,
        process.env.OTP_TOKEN_EXPIRES_IN,
      );

      const code = Generate.randomNumber(5);

      // Create otp and save it to the db
      await otpService.create({ email, code, token });

      // Send otp to user email
      const payload = {
        subject: "Welcome to Efiko Kids",
        to: [email],
        html: `Kindly use this code <p><b>${code}</b></p> to verify your account.`,
      };

      // Send otp to user email
      Mailer.gmailSender(payload);

      return res
        .status(STATUS_CODE.SUCCESS)
        .json({ success: true, message: "Otp sent" });
    } catch (error: any) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
