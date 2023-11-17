// import '../base'

// model refresh_tokens extends Base {
//   token String @length(255)
//   user_id String @length(255)
//   revoked Boolean
//   parent String @length(255)
//   session_id String
//   refresh_tokens_pkey primary key (id)
//   refresh_tokens_token_unique unique (token)
//   refresh_tokens_session_id_fkey foreign key (session_id) references auth.sessions (id) on delete cascade
// }
