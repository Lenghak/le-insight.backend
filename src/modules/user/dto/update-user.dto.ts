import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsPhoneNumber,
  IsString,
  Max,
} from "class-validator";

export class UpdateUserDTO {
  @IsDate()
  readonly confirmedAt: Date;

  @IsString()
  @Max(255)
  readonly confirmation_token: string;

  @IsDate()
  readonly confirmation_sent_at: Date;

  //TODO : Add Role field for update
  // @IsEnum(UserRoleEnum)
  // readonly role:  | SQL;

  @IsEmail()
  @IsString()
  readonly email: string;

  @IsDate()
  readonly email_confirmed_at: Date;

  @IsString()
  @Max(255)
  readonly email_change_token_current: string;

  @IsString()
  @Max(255)
  readonly email_change_token_new: string;

  @IsString()
  @Max(255)
  readonly email_change: string;

  @IsDate()
  readonly email_change_sent_at: Date;

  @IsBoolean()
  readonly email_change_confirm_status: boolean;

  @IsString()
  @Max(255)
  readonly encrypted_password: string;

  @IsString()
  @Max(255)
  readonly recovery_token: string;

  @IsDate()
  readonly recovery_sent_at: Date;

  @IsString()
  @IsPhoneNumber()
  readonly phone: string;

  @IsDate()
  readonly phone_confirmed_at: Date;

  @IsString()
  @IsPhoneNumber()
  readonly phone_change: string;

  @IsString()
  readonly phone_change_token: string;

  @IsDate()
  readonly phone_change_sent_at: Date;

  @IsString()
  @Max(255)
  readonly reauthentication_token: string;

  @IsDate()
  readonly reauthentication_sent_at: Date;

  @IsDate()
  readonly banned_until: Date;

  @IsDate()
  readonly last_sign_in_at: Date;

  @IsDate()
  readonly invited_at: Date;

  @IsDate()
  readonly created_at: Date;

  @IsDate()
  readonly updated_at: Date;

  @IsDate()
  readonly deleted_at: Date;
}
