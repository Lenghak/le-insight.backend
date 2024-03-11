import { SetMetadata } from "@nestjs/common";

import { type UserRoleEnum } from "@/database/schemas/users/users.type";

export const Roles = (...role: UserRoleEnum[]) => SetMetadata("role", role);
