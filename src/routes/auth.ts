import express from "express";
import { AuthController } from "../Controllers/AuthController";
import { UserService } from "../services/UserServices";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService, userRepository);

router.post("/register", (req, res, next) =>
  authController.register(req, res, next),
);

export default router;
