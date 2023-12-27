import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RefreshTokensStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(protected readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("REFRESH_TOKEN_SECRET"),
      passReqToCallback: true,
    });
  }

  validate(payload: Record<string, unknown>) {
    return payload;
  }
}
