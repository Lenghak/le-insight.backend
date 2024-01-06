import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";

import { SignInDTO } from "@/modules/auth/dto/sign-in.dto";

import { IsNotEmpty, IsString, IsUUID } from "class-validator";

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
  @IsString()
  @IsNotEmpty()
  salt: string;

  @ApiHideProperty()
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  profileID: string;
}
