import { Response, NextFunction } from "express";
import { UserService } from "../services/UserServices";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { CreateUserRequest } from "../types";

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: CreateUserRequest, res: Response, next: NextFunction) {
    // Validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    const { firstName, lastName, email, password, role, tenantId } = req.body;
    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
      });
      res
        .status(201)
        .json({ id: user.id, message: "User has been created successfully." });
    } catch (err) {
      next(err);
    }
  }
}
