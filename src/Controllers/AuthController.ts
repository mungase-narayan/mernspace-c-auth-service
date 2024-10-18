import { Response } from "express";
import { RegisterUser } from "../types";
import { UserService } from "../services/UserServices";

export class AuthController {
  constructor(private userService: UserService) {}

  async register(req: RegisterUser, res: Response) {
    const { firstName, lastName, email, password } = req.body;
    await this.userService.create({ firstName, lastName, email, password });
    res.status(201).json();
  }
}
