import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { LocalesController } from "src/locales/locales.controller";

import { LocalesService } from "src/locales/locales.service";

import { Locale } from "src/locales/entities/locale.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Locale])],
  controllers: [LocalesController],
  providers: [LocalesService],
})
export class LocalesModule {}
