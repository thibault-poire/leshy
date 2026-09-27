import { Controller, Get, Param } from "@nestjs/common";

import { PlantsService } from "src/plants/plants.service";

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
}
