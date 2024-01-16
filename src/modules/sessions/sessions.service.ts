import { Injectable } from "@nestjs/common";

import { type CreateSessionsDTO } from "./dto/create-sessions.dto";
import { SessionsRepository } from "./sessions.repository";

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async create(createSesstionDTO: CreateSessionsDTO) {
    return await this.sessionsRepository
      .create()
      .execute({ ...createSesstionDTO });
  }
}
