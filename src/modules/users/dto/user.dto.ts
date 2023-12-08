import "@nestjs/swagger";
import { ApiPropertyOptional } from "@nestjs/swagger";

import { UserRoleEnum } from "@/common/types/modules/user.enum";
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

export class UserDTO {
  @IsString()
  @IsUUID()
  readonly id: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(255)
  readonly aud: string;

  @ApiPropertyOptional()
  @IsDateString()
  readonly confirmedAt: Date;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(255)
  readonly confirmation_token: string;

  @ApiPropertyOptional()
  @IsDateString()
  readonly confirmation_sent_at: Date;

  @ApiPropertyOptional({ enum: UserRoleEnum })
  @IsEnum(UserRoleEnum)
  readonly role: UserRoleEnum;

  @ApiPropertyOptional()
  @IsBoolean()
  readonly is_sso_user: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  readonly is_super_admin: boolean;

  @ApiPropertyOptional()
  @IsEmail()
  @IsString()
  readonly email: string;

  @ApiPropertyOptional()
  @IsDateString()
  readonly email_confirmed_at: Date;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(255)
  readonly email_change_token_current: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(255)
  readonly email_change_token_new: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(255)
  readonly email_change: string;

  @ApiPropertyOptional()
  @IsDateString()
  readonly email_change_sent_at: Date;

  @ApiPropertyOptional()
  @IsBoolean()
  readonly email_change_confirm_status: boolean;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(255)
  readonly encrypted_password: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(325)
  readonly salt: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(255)
  readonly recovery_token: string;

  @ApiPropertyOptional()
  @IsDateString()
  readonly recovery_sent_at: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsPhoneNumber()
  readonly phone: string;

  @ApiPropertyOptional()
  @IsDateString()
  readonly phone_confirmed_at: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsPhoneNumber()
  readonly phone_change: string;

  @ApiPropertyOptional()
  @IsString()
  readonly phone_change_token: string;

  @ApiPropertyOptional()
  @IsDateString()
  readonly phone_change_sent_at: Date;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(255)
  readonly reauthentication_token: string;

  @ApiPropertyOptional()
  @IsDateString()
  readonly reauthentication_sent_at: Date;

  @ApiPropertyOptional()
  @IsDateString()
  readonly banned_until: Date;

  @ApiPropertyOptional()
  @IsDateString()
  readonly last_sign_in_at: Date;

  @ApiPropertyOptional()
  @IsDateString()
  readonly invited_at: Date;

  @ApiPropertyOptional()
  @IsDateString()
  readonly created_at: Date;

  @ApiPropertyOptional()
  @IsDateString()
  readonly updated_at: Date;

  @ApiPropertyOptional()
  @IsDateString()
  readonly deleted_at: Date;
}
