import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../Controllers/AuthController";
import { UserService } from "../services/UserServices";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import registerValidator from "../validators/register-validator";
import { TokenServices } from "../services/TokenServices";
import { RefreshToken } from "../entity/RefreshToken";
import loginValidator from "../validators/login-validator";
import { CredentialService } from "../services/CredentialService";
import authenticate from "../middlewares/authenticate";
import { AuthRequest } from "../types";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

const credentialService = new CredentialService();

const tokenService = new TokenServices(refreshTokenRepository);
const userService = new UserService(userRepository);

const authController = new AuthController(
  userService,
  tokenService,
  credentialService,
);

router.post(
  "/register",
  registerValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
);

router.post(
  "/login",
  loginValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next),
);

router.get("/self", authenticate, (req: Request, res: Response) =>
  authController.self(req as AuthRequest, res),
);

export default router;
