import { expressjwt } from "express-jwt";
import { Request } from "express";
import { AuthCookie } from "../types";
import { Config } from "../config";

export default expressjwt({
  secret: Config.RESPONSE_TOKEN_SECRET!,
  algorithms: ["HS256"],
  getToken(req: Request) {
    const { refreshToken } = req.cookies as AuthCookie;
    return refreshToken;
  },
});
