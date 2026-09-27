import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Locale } from "src/locales/entities/locale.entity";

import type { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class LocalesService {
  constructor(@InjectRepository(Locale) private readonly locale_repository: Repository<Locale>) {}

  get_all() {
    return this.locale_repository.find();
  }

  async get_one(filters: FindOptionsWhere<Locale>) {
    const locale = await this.locale_repository.findOneBy(filters);

    if (!locale) {
      throw new NotFoundException();
    }

    return locale;
  }
}
