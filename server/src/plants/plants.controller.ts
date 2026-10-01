import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";

import { PlantsService } from "src/plants/plants.service";

import { AddPlantDto, PatchPlantDto, UpdatePlantDto } from "src/plants/dto/plant.dto";

@Controller("plants")
export class PlantsController {
  constructor(private readonly plants_service: PlantsService) {}

  @Get()
  get_all() {
    return this.plants_service.get_all();
  }

  @Get(":id")
  get_one(@Param("id") id: string) {
    return this.plants_service.get_one({ id });
  }

  @Post()
  add_one(@Body() dto: AddPlantDto) {
    return this.plants_service.add_one(dto);
  }

  @Put(":id")
  update_one(@Param("id") id: string, @Body() dto: UpdatePlantDto) {
    return this.plants_service.update_one(id, dto);
  }

  @Patch(":id")
  patch_one(@Param("id") id: string, @Body() dto: PatchPlantDto) {
    return this.plants_service.patch_one(id, dto);
  }

  @Delete(":id")
  delete_one(@Param("id") id: string) {
    return this.plants_service.delete_one(id);
  }
}
