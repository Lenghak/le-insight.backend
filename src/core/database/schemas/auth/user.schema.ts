// import "../base"

// /**
// * Role
// */
// enum UserRole {
//   GUEST
//   USER
//   ADMIN
// }

// /**
// * User model
// */
// model User  extends Base {

//   aud String

//   role String

//   email String @unique() @email()
//   email_confirm_at Boolean @default(false)
//   email_change String
//   email_changed_at DateTime

//   encrypted_password String @password() @omit() @length(8, 16)

//   confirmation_token String @length(255)
//   confirmation_sent_at DateTime
//   confirmed_at DateTime

//   recovery_token String @length(255)
//   recorvery_sent_at DateTime

//   is_super_admin Boolean @default(false)

//   phone String
//   phone_confirmation_at DateTime
//   phone_change String
//   phone_change_token String
//   phone_changed_at DateTime

//   is_banned Boolean @default(false)
//   last_banned_at DateTime
//   banned_until DateTime

//   deleted_at DateTime

//   // everybody can signup
//   @@allow('create', true)

//   // full access by self
//   @@allow('all', auth() == this)
// }
