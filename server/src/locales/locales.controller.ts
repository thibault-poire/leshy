import { Controller, Get, Param } from "@nestjs/common";

import { LocalesService } from "src/locales/locales.service";

@Controller("locales")
export class LocalesController {
  constructor(private readonly locales_service: LocalesService) {}

  @Get()
  get_all() {
    return this.locales_service.get_all();
  }

  @Get(":id")
  get_one(@Param("id") id: string) {
    return this.locales_service.get_one({ id });
  }
}
