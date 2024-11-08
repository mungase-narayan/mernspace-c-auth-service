import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";

import { Roles } from "../constants";

import { UserController } from "../Controllers/UserController";
import { UserService } from "../services/UserServices";
import { User } from "../entity/User";
import { AppDataSource } from "../config/data-source";
import { CreateUserRequest, UpdateUserRequest } from "../types";
import logger from "../config/logger";
import updateUserValidator from "../validators/update-user-validator";
import listUsersValidator from "../validators/list-users-validator";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);

const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);

router.post(
  "/",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]),
  (req: CreateUserRequest, res: Response, next: NextFunction) =>
    userController.createUser(req, res, next) as unknown as RequestHandler,
);

router.patch(
  "/:id",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]),
  updateUserValidator,
  (req: UpdateUserRequest, res: Response, next: NextFunction) =>
    userController.update(req, res, next) as unknown as RequestHandler,
);

router.get(
  "/getAll",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]),
  listUsersValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getAll(req, res, next) as unknown as RequestHandler,
);

router.get(
  "/getOne/:id",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    userController.getOne(req, res, next) as unknown as RequestHandler,
);

router.delete(
  "/delete/:id",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]),
  (req, res, next) =>
    userController.destroy(req, res, next) as unknown as RequestHandler,
);
export default router;
