import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";

import paginationHelper from "@/common/helpers/pagination.helper";

import { ClassificationsService } from "@/modules/classifications/classifications.service";
import type { ApplyASDTO } from "@/modules/sensitivities/dto/apply-as.dto";
import type { CreateASDTO } from "@/modules/sensitivities/dto/create-as.dto";
import type { CreateSensitivitiesDto } from "@/modules/sensitivities/dto/create-sensitivities.dto";
import type { DeleteASDTO } from "@/modules/sensitivities/dto/delete-as.dto";
import type { GenerateASDTO } from "@/modules/sensitivities/dto/generate-as.dto";
import type { GenerateSensitivitiesDTO } from "@/modules/sensitivities/dto/generate-sensitivities.dto";
import type { GetSensitivitiesListDTO } from "@/modules/sensitivities/dto/get-sensitivities-list.dto";
import type { UpdateSensitivitiesDto } from "@/modules/sensitivities/dto/update-sensitivities.dto";
import { SensitivitiesRepository } from "@/modules/sensitivities/sensitivities.repository";

import * as schema from "@/database/models";
import { SensitivitySentimentSchema } from "@/database/schemas/articles-sensitivities/articles-sensitivities.schema";
import type { ArticlesSensitivitiesType } from "@/database/schemas/articles-sensitivities/articles-sensitivities.type";
import type { SensitivitiesType } from "@/database/schemas/sensitivities/sensitivities.type";
import type { DatabaseType } from "@/database/types/db.type";

@Injectable()
export class SensitivitiesService {
  constructor(
    private readonly sensitivitiesRepository: SensitivitiesRepository,
    private readonly classificationService: ClassificationsService,
  ) {}

  async list({
    limit = 50,
    page = 1,
    status,
    ...params
  }: GetSensitivitiesListDTO) {
    const count = (await this.count({ q: params.q, status }))[0].value;
    const { hasNextPage, hasPreviousPage, offset, totalPages } =
      paginationHelper({ count, limit, page });

    const sensitivities = await this.sensitivitiesRepository.list({
      limit,
      offset,
      status,
      ...params,
    });

    return {
      data: sensitivities,
      meta: {
        count,
        page,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async count({ q, status }: GetSensitivitiesListDTO) {
    return await this.sensitivitiesRepository.count({ q, status });
  }

  async get({
    by,
    values,
  }: {
    by: keyof SensitivitiesType;
    values: Record<string, unknown>;
  }) {
    return (await this.sensitivitiesRepository.get({ by }).execute(values)).at(
      0,
    );
  }

  async create(createSensitivitiesDto: CreateSensitivitiesDto) {
    const existingSensitivities = await this.get({
      by: "label",
      values: {
        label: createSensitivitiesDto.label,
      },
    });

    if (existingSensitivities) {
      throw new ConflictException(
        "Category with the input label is already exist.",
      );
    }

    return await this.sensitivitiesRepository.create(createSensitivitiesDto);
  }

  async update(id: string, updateSensitivitiesDto: UpdateSensitivitiesDto) {
    return await this.sensitivitiesRepository.update(
      id,
      updateSensitivitiesDto,
    );
  }

  async delete({ id }: { id: string }) {
    return await this.sensitivitiesRepository.delete({ id });
  }

  async all(columns?: Record<string, true>) {
    return await this.sensitivitiesRepository.all(columns);
  }

  async generate(generateSensitivitiesDTO: GenerateSensitivitiesDTO) {
    const sensitivities = (await this.all()).sort();

    const response = await this.classificationService.sensitize({
      article: generateSensitivitiesDTO.article,
      sensitivities: sensitivities.map((cat) => cat.label),
    });

    response.sensitivities.map(async (cate) => {
      const currSensitivities = await this.get({
        by: "label",
        values: { label: cate.label },
      });

      if (currSensitivities)
        await this.updateCounter({
          sensitivities_id: currSensitivities?.id,
          counterType: "generate",
          op: "+",
        });
    });

    return response;
  }

  async updateCounter({
    sensitivities_id,
    counterType,
    op,
  }: {
    sensitivities_id: string;
    counterType: "assign" | "generate";
    op: "+" | "-";
  }) {
    const currCate = await this.get({
      by: "id",
      values: { id: sensitivities_id },
    });

    return await this.update(sensitivities_id, {
      assigned_count:
        counterType === "assign"
          ? (currCate?.assigned_count ?? 0) + (op === "+" ? 1 : -1)
          : undefined,
      generated_count:
        counterType === "generate"
          ? (currCate?.generated_count ?? 0) + (op === "+" ? 1 : -1)
          : undefined,
    });
  }

  async bridge(
    createASDTO: CreateASDTO,
    db?: DatabaseType | DatabaseType<typeof schema>,
  ) {
    const acs = await this.sensitivitiesRepository.bridge(createASDTO, db);

    for (const ac of acs) {
      await this.updateCounter({
        sensitivities_id: ac.sensitivity_id,
        counterType: "assign",
        op: "+",
      });
    }

    return acs;
  }

  async apply({ article, sensitivities }: ApplyASDTO) {
    const bridged: ArticlesSensitivitiesType[] = [];

    for (const sensitivity of sensitivities
      .sort((a, b) => b.rate - a.rate)
      .filter((sensitivitiy) => sensitivitiy.rate >= 0.75)
      .slice(0, 3)) {
      const ligitSensitivity = sensitivity.label
        ? await this.get({
            by: "label",
            values: {
              label: sensitivity.label,
            },
          })
        : undefined;

      if (ligitSensitivity?.id && ligitSensitivity.status === "ACTIVE")
        bridged.push(
          ...(await this.bridge({
            article_id: article.id,
            sensitivity_id: ligitSensitivity.id,
            sentiment:
              SensitivitySentimentSchema.Values[
                sensitivity.sentiment.toUpperCase()
              ],
          })),
        );
    }

    return bridged;
  }

  async regenerate(generateASDto: GenerateASDTO) {
    if (!generateASDto.article)
      throw new UnprocessableEntityException(
        "Cannot find article with the current ID",
      );

    const sensitivities = generateASDto.article.content_plain_text
      ? (
          await this.generate({
            article: generateASDto.article.content_plain_text,
          })
        ).sensitivities
      : [];

    await this.detach({
      article_id: generateASDto.article.id,
    });
    return await this.apply({ article: generateASDto.article, sensitivities });
  }

  async detach(deleteASDTO: DeleteASDTO) {
    const deletedAcs = await this.sensitivitiesRepository.break(deleteASDTO);

    for (const ac of deletedAcs) {
      await this.updateCounter({
        sensitivities_id: ac.sensitivity_id,
        counterType: "assign",
        op: "-",
      });
    }

    return deletedAcs;
  }
}
