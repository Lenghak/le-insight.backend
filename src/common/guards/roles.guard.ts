import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { type UserRoleEnum } from "@/database/schemas/users/users.type";

import { type FastifyRequest } from "fastify/types/request";
import { type Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRoleEnum[]>("role", [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!roles) return true;

    const req: FastifyRequest["raw"] = context.switchToHttp().getRequest();

    return roles?.some((role) => req["user"].role?.includes(role));
  }
}
