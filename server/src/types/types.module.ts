import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TypesController } from "src/types/types.controller";

import { TypesService } from "src/types/types.service";

import { Type } from "src/types/entities/type.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Type])],
  controllers: [TypesController],
  providers: [TypesService],
})
export class TypesModule {}
