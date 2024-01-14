import { IsJWT, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateRefreshTokensDTO {
  @IsString()
  @IsJWT()
  @IsNotEmpty()
  token?: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userID?: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  sessionID?: string;
}
