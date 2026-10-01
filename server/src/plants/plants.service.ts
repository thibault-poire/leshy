import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Plant } from "src/plants/entities/plant.entity";

import { AddPlantDto, PatchPlantDto, UpdatePlantDto } from "src/plants/dto/plant.dto";

import type { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class PlantsService {
  constructor(@InjectRepository(Plant) private readonly plant_repository: Repository<Plant>) {}

  get_all() {
    return this.plant_repository.find();
  }

  async get_one(filters: FindOptionsWhere<Plant>) {
    const plant = await this.plant_repository.findOneBy(filters);

    if (!plant) {
      throw new NotFoundException();
    }

    return plant;
  }

  async add_one(dto: AddPlantDto) {
    const plant = this.plant_repository.create(dto);

    return this.plant_repository.save(plant);
  }

  async update_one(id: string, dto: UpdatePlantDto) {
    const plant = await this.get_one({ id });

    return this.plant_repository.save({ ...plant, ...dto });
  }

  async patch_one(id: string, dto: PatchPlantDto) {
    const plant = await this.get_one({ id });

    return this.plant_repository.save({ ...plant, ...dto });
  }

  async delete_one(id: string) {
    const plant = await this.get_one({ id });

    await this.plant_repository.delete(plant.id);
  }
}
