import { Controller, Get, Param } from "@nestjs/common";

import { DiseasesService } from "src/diseases/diseases.service";

@Controller("diseases")
export class DiseasesController {
  constructor(private readonly diseases_service: DiseasesService) {}

  @Get()
  get_all() {
    return this.diseases_service.get_all();
  }

  @Get(":id")
  get_one(@Param("id") id: string) {
    return this.diseases_service.get_one({ id });
  }
}
