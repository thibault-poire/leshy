import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Type } from "src/types/entities/type.entity";

import type { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class TypesService {
  constructor(@InjectRepository(Type) private readonly type_repository: Repository<Type>) {}

  get_all() {
    return this.type_repository.find();
  }

  async get_one(filters: FindOptionsWhere<Type>) {
    const type = await this.type_repository.findOneBy(filters);

    if (!type) {
      throw new NotFoundException();
    }

    return type;
  }
}
