import { ApiProperty } from "@nestjs/swagger";

import { SignInDTO } from "@/modules/auth/dto/sign-in.dto";

import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class SignUpDTO extends SignInDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @MaxLength(255)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @MaxLength(255)
  lastName: string;
}
