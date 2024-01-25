import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { type FastifyRequest } from "fastify";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RefreshTokensStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(protected readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("REFRESH_TOKEN_SECRET"),
      passReqToCallback: true,
    });
  }

  validate(req: FastifyRequest, payload: Record<string, unknown>) {
    // refreshToken
    const rt = req.headers["authorization"]?.replace("Bearer ", "").trim();

    return {
      ...payload,
      rt,
    };
  }
}
