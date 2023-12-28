import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";

import { SignInDTO } from "@/modules/auth/dto/sign-in.dto";

import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDTO extends SignInDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;

  @ApiHideProperty()
  salt: string;
}
