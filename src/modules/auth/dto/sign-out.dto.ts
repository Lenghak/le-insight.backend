import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class SignOutDTO {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userID: string;
}
