import fs from "fs";
import path from "path";

import { JwtPayload, sign } from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { Repository } from "typeorm";
import { validationResult } from "express-validator";

import { RegisterUser } from "../types";
import { UserService } from "../services/UserServices";
import { User } from "../entity/User";
import { Config } from "../config";
import createHttpError from "http-errors";

export class AuthController {
  constructor(
    private userService: UserService,
    private userRepository: Repository<User>,
  ) {}

  async register(req: RegisterUser, res: Response, next: NextFunction) {
    //Validations
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { role, firstName, lastName, email, password } = req.body;
    if (!email || !firstName || !lastName || !password || !role) {
      res.status(400).json({ Error: "All fields are required" });
      return;
    }
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
      // Generate JWT tokens
      const payload: JwtPayload = { sub: String(user.id), role: user.role };
      let privateKey: Buffer;
      try {
        privateKey = fs.readFileSync(
          path.join(__dirname, "../../certs/private.pem"),
        );
      } catch (err) {
        const error = createHttpError(500, "Error while reading private key");
        next(error);
        return;
      }

      const accessToken = sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: "auth_service",
      });
      const refreshToken = sign(payload, Config.RESPONSE_TOKEN_SECRET!, {
        algorithm: "HS256",
        expiresIn: "1y",
        issuer: "auth_service",
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, //1hrs
        httpOnly: true, //Very Important
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, //1Year
        httpOnly: true, //Very Important
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
