import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SpacesController } from "src/spaces/spaces.controller";

import { SpacesService } from "src/spaces/spaces.service";

import { Space } from "src/spaces/entities/space.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Space])],
  controllers: [SpacesController],
  providers: [SpacesService],
})
export class SpacesModule {}
