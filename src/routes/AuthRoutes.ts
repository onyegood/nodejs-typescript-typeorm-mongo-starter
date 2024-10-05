import { Router } from "express";

import { AuthController } from "@/controllers/AuthController";

const router = Router();
const authController = new AuthController();

router.post("/auth/login", authController.login.bind(authController));
router.post(
  "/auth/verify-account",
  authController.verifyAccount.bind(authController),
);
router.post(
  "/auth/reset-password",
  authController.resetPassword.bind(authController),
);

export default router;
