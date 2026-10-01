import { TypesController } from "./types.controller";
import { TypesService } from "./types.service";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { NotFoundException } from "@nestjs/common";

describe("TypesController", () => {
  let controller: TypesController;
  let service: Partial<TypesService>;

  beforeEach(() => {
    service = {
      get_all: vi.fn(),
      get_one: vi.fn(),
    };

    controller = new TypesController(service as TypesService);
  });

  describe("get_all", () => {
    it("should return all types", async () => {
      const expected = [{ id: "uuid-1" }, { id: "uuid-2" }];

      vi.spyOn(service, "get_all").mockResolvedValue(expected);

      const result = await controller.get_all();

      expect(result).toBe(expected);
      expect(service.get_all).toHaveBeenCalledTimes(1);
    });

    it("should propagate NotFoundException when no types found", async () => {
      vi.spyOn(service, "get_all").mockRejectedValue(new NotFoundException("Not found"));

      await expect(controller.get_all()).rejects.toThrow(NotFoundException);
    });
  });

  describe("get_one", () => {
    it("should return one type by id", async () => {
      const expected = { id: "uuid-1" };

      vi.spyOn(service, "get_one").mockResolvedValue(expected);

      const result = await controller.get_one("uuid-1");

      expect(result).toBe(expected);
      expect(service.get_one).toHaveBeenCalledWith({ id: "uuid-1" });
    });

    it("should propagate NotFoundException when type not found", async () => {
      vi.spyOn(service, "get_one").mockRejectedValue(new NotFoundException("Not found"));

      await expect(controller.get_one("uuid-not-found")).rejects.toThrow(NotFoundException);
    });
  });
});
