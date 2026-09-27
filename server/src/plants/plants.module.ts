import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PlantsController } from "src/plants/plants.controller";

import { PlantsService } from "src/plants/plants.service";

import { Plant } from "src/plants/entities/plant.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Plant])],
  controllers: [PlantsController],
  providers: [PlantsService],
})
export class PlantsModule {}
