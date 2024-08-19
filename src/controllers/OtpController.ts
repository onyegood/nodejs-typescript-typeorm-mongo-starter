import { Request, Response } from "express";

import { STATUS_CODE } from "@/constants/StatusCode";
import { OtpService } from "@/services/OtpService";

const otpService = new OtpService();

export class OtpController {
  public async createOtp(req: Request, res: Response): Promise<Response> {
    try {
      const otp = await otpService.create(req.body);
      return res.status(STATUS_CODE.CONTENT_CREATED).json(otp);
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ error: "Error creating Otp" });
    }
  }

  public async deleteOtp(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.body;

      const deleted = await otpService.delete(id);
      return deleted
        ? res.status(STATUS_CODE.SUCCESS).json({ message: "Deleted" })
        : res.status(STATUS_CODE.NOT_FOUND).json({ message: "OTP not found" });
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ error: "Error deleting Otp" });
    }
  }
}
