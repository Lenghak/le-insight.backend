import { Injectable } from "@nestjs/common";

import { type DatabaseType } from "@/database/types/db.type";

import { type CreateSessionsDTO } from "./dto/create-sessions.dto";
import { type DeleteSessionDTO } from "./dto/delete-sessions.dto";
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

  async delete(deleteSessionDTO: DeleteSessionDTO, db?: DatabaseType) {
    return await this.sessionsRepository.delete(db).execute({
      sessionID: deleteSessionDTO.sessionID,
    });
  }
}
