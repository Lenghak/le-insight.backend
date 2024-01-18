import { ApiHideProperty, PartialType } from "@nestjs/swagger";

import { type UserRoleEnum } from "../types/users.enum";
import { UserDTO } from "./user.dto";

export class UpdateUserDTO extends PartialType(UserDTO) {
  @ApiHideProperty()
  readonly id: string;

  @ApiHideProperty()
  readonly role: UserRoleEnum;
}
