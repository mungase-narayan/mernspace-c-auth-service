import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { Repository } from "typeorm";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

import { RegisterUser } from "../types";
import { UserService } from "../services/UserServices";
import { TokenServices } from "../services/TokenServices";
import { User } from "../entity/User";
import createHttpError from "http-errors";
import { CredentialService } from "../services/CredentialService";
import logger from "../config/logger";

export class AuthController {
  constructor(
    private userService: UserService,
    private userRepository: Repository<User>,
    private tokenService: TokenServices,
    private credentialService: CredentialService,
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
    const user = await this.userService.findByEmail(email);
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

      const accessToken = this.tokenService.generateAccessToken(payload);

      //Persist the refresh token
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
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
      console.log(error);
      return;
    }
  }

  async login(req: RegisterUser, res: Response, next: NextFunction) {
    //Validations
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      res.status(401).json({ Error: "All fields are required" });
      return;
    }

    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        res.status(401).json({ Error: "Invalid email or password" });
        const error = createHttpError(401, "Invalid email or password");
        next(error);
        return;
      }

      const passwordMatch = await this.credentialService.comparePassword(
        password,
        user.password,
      );
      if (!passwordMatch) {
        res.status(401).json({ Error: "Invalid email or password" });
        const error = createHttpError(4001, "Invalid email or password");
        next(error);
        return;
      }

      // Generate JWT tokens
      const payload: JwtPayload = { sub: String(user.id), role: user.role };
      const accessToken = this.tokenService.generateAccessToken(payload);

      //Persist the refresh token
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);
      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
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

      logger.info("Login successful!");
      res.status(201).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: "Login successful!",
      });
      return;
    } catch (error) {
      next(error);
      console.log(error);
      return;
    }
  }
}
