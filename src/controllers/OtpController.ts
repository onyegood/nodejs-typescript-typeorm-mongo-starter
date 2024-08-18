import { Request, Response } from "express";

import { OtpService } from "@/services/OtpService";

const otpService = new OtpService();

export class OtpController {
  public async createOtp(req: Request, res: Response): Promise<Response> {
    try {
      const otp = await otpService.create(req.body);
      return res.status(201).json(otp);
    } catch (error) {
      return res.status(500).json({ error: "Error creating Otp" });
    }
  }

  public async deleteOtp(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.body;

      const deleted = await otpService.delete(id);
      return deleted
        ? res.status(200).json({ message: "Deleted" })
        : res.status(404).json({ message: "OTP not found" });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting Otp" });
    }
  }
}
