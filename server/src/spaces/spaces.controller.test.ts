import { SpacesController } from "./spaces.controller";
import { SpacesService } from "./spaces.service";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { NotFoundException } from "@nestjs/common";

describe("SpacesController", () => {
  let controller: SpacesController;
  let service: Partial<SpacesService>;

  beforeEach(() => {
    service = {
      get_all: vi.fn(),
      get_one: vi.fn(),
    };

    controller = new SpacesController(service as SpacesService);
  });

  describe("get_all", () => {
    it("should return all spaces", async () => {
      const expected = [
        { id: "uuid-1", name: "Space 1" },
        { id: "uuid-2", name: "Space 2" },
      ];

      vi.spyOn(service, "get_all").mockResolvedValue(expected);

      const result = await controller.get_all();

      expect(result).toBe(expected);
      expect(service.get_all).toHaveBeenCalledTimes(1);
    });

    it("should propagate NotFoundException when no spaces found", async () => {
      vi.spyOn(service, "get_all").mockRejectedValue(new NotFoundException("Not found"));

      await expect(controller.get_all()).rejects.toThrow(NotFoundException);
    });
  });

  describe("get_one", () => {
    it("should return one space by id", async () => {
      const expected = { id: "uuid-1", name: "Test Space" };

      vi.spyOn(service, "get_one").mockResolvedValue(expected);

      const result = await controller.get_one("uuid-1");

      expect(result).toBe(expected);
      expect(service.get_one).toHaveBeenCalledWith({ id: "uuid-1" });
    });

    it("should propagate NotFoundException when space not found", async () => {
      vi.spyOn(service, "get_one").mockRejectedValue(new NotFoundException("Not found"));

      await expect(controller.get_one("uuid-not-found")).rejects.toThrow(NotFoundException);
    });
  });
});
