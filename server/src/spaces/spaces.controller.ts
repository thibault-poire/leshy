import { Controller, Get, Param } from "@nestjs/common";

import { SpacesService } from "src/spaces/spaces.service";

@Controller("spaces")
export class SpacesController {
  constructor(private readonly spaces_service: SpacesService) {}

  @Get()
  get_all() {
    return this.spaces_service.get_all();
  }

  @Get(":id")
  get_one(@Param("id") id: string) {
    return this.spaces_service.get_one({ id });
  }
}
