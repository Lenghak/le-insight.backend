import { SetMetadata } from "@nestjs/common";

import { type UserRoleEnum } from "@/database/schemas/auth/users/users.type";

export const Role = (role: UserRoleEnum) => SetMetadata("role", role);
