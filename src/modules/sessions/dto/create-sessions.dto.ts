import {
  IsDateString,
  IsIP,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

export class CreateSessionsDTO {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userID: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  userAgent: string;

  @IsString()
  @IsIP()
  @IsNotEmpty()
  @MaxLength(255)
  ip: string;

  @IsDateString()
  @IsNotEmpty()
  @MaxLength(255)
  notAfter: Date;
}
