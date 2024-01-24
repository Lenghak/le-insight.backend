import { Injectable } from "@nestjs/common";

import { type DatabaseType } from "@/database/types/db.types";

import { type CreateSessionsDTO } from "./dto/create-sessions.dto";
import { SessionsRepository } from "./sessions.repository";

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async create(createSesstionDTO: CreateSessionsDTO, db?: DatabaseType) {
    return await this.sessionsRepository.create(db).execute({
      userID: createSesstionDTO.userID,
      ip: createSesstionDTO.ip,
      userAgent: createSesstionDTO.userAgent,
    });
  }
}
