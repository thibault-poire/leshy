import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Disease } from "src/diseases/entities/disease.entity";

import type { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class DiseasesService {
  constructor(@InjectRepository(Disease) private readonly disease_repository: Repository<Disease>) {}

  get_all() {
    return this.disease_repository.find();
  }

  async get_one(filters: FindOptionsWhere<Disease>) {
    const disease = await this.disease_repository.findOneBy(filters);

    if (!disease) {
      throw new NotFoundException();
    }

    return disease;
  }
}
