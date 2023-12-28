import { IsJWT, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UpdateRefreshTokensDTO {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsJWT()
  @IsNotEmpty()
  token: string;
}
