import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Space } from "src/spaces/entities/space.entity";

import type { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class SpacesService {
  constructor(@InjectRepository(Space) private readonly space_repository: Repository<Space>) {}

  get_all() {
    return this.space_repository.find();
  }

  async get_one(filters: FindOptionsWhere<Space>) {
    const space = await this.space_repository.findOneBy(filters);

    if (!space) {
      throw new NotFoundException();
    }

    return space;
  }
}
