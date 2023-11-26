import { IsString } from "class-validator";

import { SignInDTO } from "../../auth/dto/sign-in.dto";

export class CreateUserDTO extends SignInDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
