import { expressjwt } from "express-jwt";
import { Request } from "express";

import { Config } from "../config";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import logger from "../config/logger";
import { IRefreshTokenPayload } from "../types";

export default expressjwt({
  secret: Config.RESPONSE_TOKEN_SECRET!,
  algorithms: ["HS256"],
  getToken(req: Request) {
    const { refreshToken } = req.cookies;
    return refreshToken;
  },
  async isRevoked(req: Request, token) {
    try {
      const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
      const refreshToken = refreshTokenRepo.findOne({
        where: {
          id: Number((token?.payload as IRefreshTokenPayload).id),
          user: { id: Number(token?.payload.sub) },
        },
      });
      console.log("Id", (token?.payload as IRefreshTokenPayload).id);
      return refreshToken === null;
    } catch (error) {
      logger.error({
        msg: "Error while getting the refresh token",
        data: { id: (token?.payload as IRefreshTokenPayload).id },
      });
    }
    return true;
  },
});
