import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

import {
  type PayloadType,
  type PayloadWithRefreshTokenType,
} from "@/modules/auth/types/payload.type";

import { type FastifyRequest } from "fastify";

export const User = createParamDecorator(
  (
    _: undefined,
    context: ExecutionContext,
  ): PayloadType | PayloadWithRefreshTokenType => {
    const req: FastifyRequest = context.switchToHttp().getRequest();
    return req["user"];
  },
);
