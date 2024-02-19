import {
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from "@nestjs/common";

import type JSONAPISerializer from "json-api-serializer";
import { type JSONAPIDocument } from "json-api-serializer";
import { type Observable, tap } from "rxjs";

export class UsersInterceptor implements NestInterceptor {
  constructor(private readonly serializer: JSONAPISerializer) {}

  intercept(
    _: ExecutionContext,
    next: CallHandler<JSONAPIDocument>,
  ): Observable<JSONAPIDocument> | Promise<Observable<JSONAPIDocument>> {
    return next
      .handle()
      .pipe(tap((data) => this.serializer.serialize("data", data)));
  }
}
