import { Injectable } from "@nestjs/common";

import { type DatabaseType } from "@/database/types/db.type";

import { type CreateProfileDTO } from "./dto/create-profile.dto";
import { ProfilesRepository } from "./profiles.repository";

@Injectable()
export class ProfilesService {
  constructor(private readonly profileRepository: ProfilesRepository) {}

  async create({
    createProfilesDTO,
    db,
  }: {
    createProfilesDTO: CreateProfileDTO;
    db?: DatabaseType<Record<string, never>>;
  }) {
    return await this.profileRepository.create(db).execute({
      firstName: createProfilesDTO.firstName,
      lastName: createProfilesDTO.lastName,
    });
  }

  async getAll(db?: DatabaseType) {
    return await this.profileRepository.getAll(db).execute();
  }
}
