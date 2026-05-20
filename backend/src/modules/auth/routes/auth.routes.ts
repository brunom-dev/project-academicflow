import { Router } from "express";

import { validateSchema } from "../middlewares/validate-schema";
import { registerSchema } from "../schemas/register-schema";

import { AuthController } from "../controller/auth.controller";
import { AuthService } from "../service/auth.service";
import { loginSchema } from "../schemas/login-schema";

const authRoutes = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

authRoutes.post(
    "/register",
    validateSchema(registerSchema),
    authController.register,
);

authRoutes.post(
    "/login",
    validateSchema(loginSchema),
    authController.login
)

export { authRoutes };
