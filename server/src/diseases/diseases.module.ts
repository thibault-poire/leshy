import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DiseasesController } from "src/diseases/diseases.controller";

import { DiseasesService } from "src/diseases/diseases.service";

import { Disease } from "src/diseases/entities/disease.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Disease])],
  controllers: [DiseasesController],
  providers: [DiseasesService],
})
export class DiseasesModule {}
