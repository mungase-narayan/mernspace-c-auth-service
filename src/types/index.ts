import exp from "constants";
import { Request } from "express";

export interface UserData {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterUser extends Request {
  body: UserData;
}

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
    id?: string;
  };
}

export type AuthCookie = {
  accessToken: string;
  refreshToken: string;
};

export interface IRefreshTokenPayload {
  id: string;
}
