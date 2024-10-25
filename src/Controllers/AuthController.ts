import { NextFunction, Response } from "express";
import { RegisterUser } from "../types";
import { UserService } from "../services/UserServices";
import { Logger } from "winston";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async register(req: RegisterUser, res: Response, next: NextFunction) {
    const { role, firstName, lastName, email, password } = req.body;
    try {
      const user = await this.userService.create({
        role,
        firstName,
        lastName,
        email,
        password,
      });
      res
        .status(201)
        .json({ id: user.id, message: "User registration successfully" });
    } catch (error) {
      next(error);
      return;
    }
  }
}
