// import { validate } from "class-validator";
import { compare } from "bcryptjs";
import { Request, Response } from "express";

import { FEEDBACK } from "@/constants/Feedback";
import { UserType } from "@/constants/Roles";
import { STATUS_CODE } from "@/constants/StatusCode";
import { AuthService } from "@/services/AuthService";
import { OtpService } from "@/services/OtpService";
import { Generate } from "@/utils/Generate";

const authService = new AuthService();
const otpService = new OtpService();

export class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const user = await authService.login(email);

      if (!user) {
        return res
          .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: "User not found" });
      }

      const passwordMatches = await compare(password, user.password);

      if (!passwordMatches) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "User name or password is incorrect",
        });
      }

      // Generate access token
      const token = Generate.generateToken(
        String(user.id),
        String(UserType.PARENT),
      );

      // Generate refresh token
      const refreshToken = Generate.generateToken(
        String(user.id),
        String(UserType.PARENT),
        process.env.REFRESH_TOKEN_EXPIRES_IN!,
      );

      const payload = {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          role: user.role,
          verified: user.verified,
          active: user.active,
          organisationId: user.organisationId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
        refreshToken,
      };

      return res.status(STATUS_CODE.SUCCESS).json(payload);
    } catch (error: any) {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verifyAccount(req: Request, res: Response): Promise<Response> {
    try {
      const { code, email: bodyEmail } = req.body;
      const isResetPassword = req.query.reset;

      const otp = await otpService.findOtp(code);

      if (!otp) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ success: false, message: FEEDBACK.INVALID_DATA });
      }

      const decoded = await Generate.verifyToken(otp.token);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { id, email } = decoded;

      if (email !== bodyEmail) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ success: false, message: FEEDBACK.INVALID_DATA });
      }

      const updated = await authService.verifyUser(id);

      if (!isResetPassword) {
        // Delete otp from the db
        await otpService.delete(email);
      }

      if (!updated) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ success: false, message: FEEDBACK.UNAUTHORIZED });
      }

      return res
        .status(STATUS_CODE.SUCCESS)
        .json({ success: false, message: FEEDBACK.UPDATED });
    } catch (error: any) {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { code, email: userEmail, password: userPassword } = req.body;

      const otp = await otpService.findOtp(code);

      if (!otp) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ success: false, message: FEEDBACK.INVALID_DATA });
      }

      const decoded = await Generate.verifyToken(otp.token);

      const { id, email } = decoded as { id: string; email: string };

      if (email !== userEmail) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ success: false, message: FEEDBACK.INVALID_DATA });
      }

      // Hashed password
      const password = await Generate.hashPassword(userPassword);

      const isResetPassword = await authService.resetPassword(id, password);

      if (!isResetPassword) {
        // Delete otp from the db
        await otpService.delete(email);
      }

      return res
        .status(STATUS_CODE.SUCCESS)
        .json({ success: false, message: FEEDBACK.UPDATED });
    } catch (error: any) {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
