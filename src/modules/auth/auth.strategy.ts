import { PassportStrategy } from "@nestjs/passport";

import { Strategy } from "passport-jwt";

export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }
}
