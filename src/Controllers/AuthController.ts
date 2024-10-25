import { NextFunction, Response } from "express";
import { RegisterUser } from "../types";
import { UserService } from "../services/UserServices";
import { Repository } from "typeorm";
import { User } from "../entity/User";

export class AuthController {
  constructor(
    private userService: UserService,
    private userRepository: Repository<User>,
  ) {}

  async register(req: RegisterUser, res: Response, next: NextFunction) {
    const { role, firstName, lastName, email, password } = req.body;

    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (user) {
      res.status(400).json({ Error: "Email is already registered" });
      return;
    }
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
