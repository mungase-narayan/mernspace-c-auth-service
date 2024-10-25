import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../Controllers/AuthController";
import { UserService } from "../services/UserServices";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import registerValidator from "../validators/register-validator";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService, userRepository);

router.post(
  "/register",
  registerValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
);

export default router;
