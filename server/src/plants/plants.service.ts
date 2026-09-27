import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Plant } from "src/plants/entities/plant.entity";

import type { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class PlantsService {
  constructor(@InjectRepository(Plant) private readonly plant_repository: Repository<Plant>) {}

  get_all() {
    return this.plant_repository.find();
  }

  get_one(filters: FindOptionsWhere<Plant>) {
    return this.plant_repository.findOneBy(filters);
  }
}
