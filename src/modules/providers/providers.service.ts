import { Injectable } from "@nestjs/common";

import type { CreateProvidersDTO } from "@/modules/providers/dto/create-providers.dto";
import { ProvidersRepository } from "@/modules/providers/providers.respository";

import { type DatabaseType } from "@/database/types/db.type";

@Injectable()
export class ProvidersService {
  constructor(private readonly providerRespository: ProvidersRepository) {}

  async create(
    createProviderDto: CreateProvidersDTO,
    db?: DatabaseType<Record<string, never>>,
  ) {
    return await this.providerRespository.create(db).execute({
      provider: createProviderDto.provider,
      user_id: createProviderDto.user_id,
    });
  }

  async getAll(db?: DatabaseType) {
    return await this.providerRespository.getAll(db).execute();
  }
}
