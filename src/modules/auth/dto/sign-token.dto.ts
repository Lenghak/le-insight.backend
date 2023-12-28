import { IsEmail, IsString, IsUUID } from "class-validator";

export class SignTokensDTO {
  @IsString()
  @IsUUID()
  id: string;

  @IsString()
  @IsEmail()
  email: string;
}
