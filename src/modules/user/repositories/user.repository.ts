import { Injectable } from "@nestjs/common";

import {
  GenericStatmentRepository,
  type GenericStatmentReturn,
} from "@/common/types/repositories";

@Injectable()
export class UserRepository extends GenericStatmentRepository<any> {
  getAll(): GenericStatmentReturn<any> {}
  get(): GenericStatmentReturn<any> {}
  create(): void {}
  update(): GenericStatmentReturn<any> {}
  delete(): GenericStatmentReturn<any> {}
}
