import { ApiProperty } from "@nestjs/swagger";

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from "class-validator";

export class SignInDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @MaxLength(255)
  @ApiProperty()
  password: string;
}
