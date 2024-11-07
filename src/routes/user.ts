import express, { Response, NextFunction, RequestHandler } from "express";

import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";

import { Roles } from "../constants";

import { UserController } from "../Controllers/UserController";
import { UserService } from "../services/UserServices";
import { User } from "../entity/User";
import { AppDataSource } from "../config/data-source";
import { CreateUserRequest } from "../types";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);

const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post(
  "/",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]),
  (req: CreateUserRequest, res: Response, next: NextFunction) =>
    userController.createUser(req, res, next) as unknown as RequestHandler,
);

export default router;
