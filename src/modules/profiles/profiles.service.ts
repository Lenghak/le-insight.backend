import { Injectable } from "@nestjs/common";

import { type ExtractTablesWithRelations } from "drizzle-orm";
import { type PgTransaction } from "drizzle-orm/pg-core";
import {
  type PostgresJsDatabase,
  type PostgresJsQueryResultHKT,
} from "drizzle-orm/postgres-js";

import { type CreateProfileDTO } from "./dto/create-profile.dto";
import { ProfilesRepository } from "./profiles.repository";

@Injectable()
export class ProfilesService {
  constructor(private readonly profileRepository: ProfilesRepository) {}

  async create({
    createProfilesDTO,
  }: {
    createProfilesDTO: CreateProfileDTO;
    db?:
      | PostgresJsDatabase
      | PgTransaction<
          PostgresJsQueryResultHKT,
          Record<string, never>,
          ExtractTablesWithRelations<Record<string, never>>
        >;
  }) {
    return await this.profileRepository.create().execute({
      firstName: createProfilesDTO.firstName,
      lastName: createProfilesDTO.lastName,
    });
  }

  async getAll() {
    return await this.profileRepository.getAll().execute();
  }
}
