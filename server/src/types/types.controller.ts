import { Controller, Get, Param } from "@nestjs/common";

import { TypesService } from "src/types/types.service";

@Controller("types")
export class TypesController {
  constructor(private readonly types_service: TypesService) {}

  @Get()
  get_all() {
    return this.types_service.get_all();
  }

  @Get(":id")
  get_one(@Param("id") id: string) {
    return this.types_service.get_one({ id });
  }
}
