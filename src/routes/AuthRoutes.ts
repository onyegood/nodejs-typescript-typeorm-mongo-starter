import { Router } from "express";

import { AuthController } from "@/controllers/AuthController";

const router = Router();
const authController = new AuthController();

router.post("/auth/login", authController.login.bind(authController));

export default router;
