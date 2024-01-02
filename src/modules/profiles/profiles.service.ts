import { Injectable } from "@nestjs/common";

import { type CreateProfileDTO } from "./dto/create-profile.dto";
import { ProfilesRepository } from "./repo/profiles.repository";

@Injectable()
export class ProfilesService {
  constructor(private readonly profileRepository: ProfilesRepository) {}

  async create(crateProfilesDTO: CreateProfileDTO) {
    return await this.profileRepository.create(crateProfilesDTO).execute();
  }
}
