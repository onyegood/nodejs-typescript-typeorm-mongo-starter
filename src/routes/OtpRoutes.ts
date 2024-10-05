import { Router } from "express";

import { OtpController } from "@/controllers/OtpController";

const router = Router();
const otpController = new OtpController();

router.post("/otp/sendOtp", otpController.sendOTP.bind(otpController));

export default router;
