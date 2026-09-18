import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Space } from "src/spaces/entities/space.entity";

import type { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class SpacesService {
  constructor(@InjectRepository(Space) private readonly space_repository: Repository<Space>) {}

  get_all() {
    return this.space_repository.find();
  }

  get_one(filters: FindOptionsWhere<Space>) {
    return this.space_repository.findOneBy(filters);
  }
}
