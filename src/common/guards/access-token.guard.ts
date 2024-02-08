import { type ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

import { type Observable } from "rxjs";

@Injectable()
export class AccessTokenGuard extends AuthGuard("jwt-access") {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride("isPublic", [
      context.getClass(),
      context.getHandler(),
    ]);

    return isPublic ?? super.canActivate(context);
  }
}
