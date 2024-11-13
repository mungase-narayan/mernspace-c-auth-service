import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import { Repository } from "typeorm";

import { Config } from "../config";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";

export class TokenServices {
  constructor(private readonly refreshTokenRepository: Repository<RefreshToken>) {}
  generateAccessToken(payload: JwtPayload) {
    let privateKey: string;

    if (!Config.PRIVATE_KEY) {
      const error = createHttpError(
        500,
        "Private key is not set in environment variables",
      );
      throw error;
    }

    try {
      privateKey = Config.PRIVATE_KEY;
    } catch (err) {
      const error = createHttpError(500, "Error while reading private key");
      throw error;
    }

    const accessToken = sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer: "auth_service",
    });

    return accessToken;
  }

  generateRefreshToken(payload: JwtPayload) {
    const refreshToken = sign(payload, Config.RESPONSE_TOKEN_SECRET!, {
      algorithm: "HS256",
      expiresIn: "1y",
      issuer: "auth_service",
      jwtid: String(payload.id),
    });

    return refreshToken;
  }

  async persistRefreshToken(user: User) {
    //Persist the refresh token
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; //(1year) Not Consider leap years

    const newRefreshToken = await this.refreshTokenRepository.save({
      user: user,
      expiresAt: new Date(Date.now() + MS_IN_YEAR),
    });
    return newRefreshToken;
  }

  async deleteRefreshToken(tokenId: number) {
    return await this.refreshTokenRepository.delete({ id: tokenId });
  }
}
