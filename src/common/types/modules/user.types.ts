export enum UserRoleEnum {
  Admin = "Admin",
  Guest = "Guest",
  User = "User",
}

export type Users = {
  id: string;

  aud: string;

  confirmedAt: Date;

  confirmation_token: string;

  confirmation_sent_at: Date;

  role: UserRoleEnum;

  is_sso_user: boolean;

  is_super_admin: boolean;

  email: string;

  email_confirmed_at: Date;

  email_change_token_current: string;

  email_change_token_new: string;

  email_change: string;

  email_change_sent_at: Date;

  email_change_confirm_status: boolean;

  encrypted_password: string;

  recovery_token: string;

  recovery_sent_at: Date;

  phone: string;

  phone_confirmed_at: Date;

  phone_change: string;

  phone_change_token: string;

  phone_change_sent_at: Date;

  reauthentication_token: string;

  reauthentication_sent_at: Date;

  banned_until: Date;

  last_sign_in_at: Date;

  invited_at: Date;

  created_at: Date;

  updated_at: Date;

  deleted_at: Date;
};

// export type UserSelectableFields = Pick<
//   Users,
//   | "id"
//   | "banned_until"
//   | "created_at"
//   | "deleted_at"
//   | "email"
//   | "email_confirmed_at"
//   | "phone"
//   | "role"
//   | "updated_at"
// >;
