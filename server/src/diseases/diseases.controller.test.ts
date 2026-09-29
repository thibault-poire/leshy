import { DiseasesController } from "./diseases.controller";
import { DiseasesService } from "./diseases.service";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { NotFoundException } from "@nestjs/common";

describe("DiseasesController", () => {
  let controller: DiseasesController;
  let service: Partial<DiseasesService>;

  beforeEach(() => {
    service = {
      get_all: vi.fn(),
      get_one: vi.fn(),
    };

    controller = new DiseasesController(service as DiseasesService);
  });

  describe("get_all", () => {
    it("should return all diseases", async () => {
      const expected = [
        { id: "uuid-1", type_id: "type-uuid-1" },
        { id: "uuid-2", type_id: "type-uuid-2" },
      ];

      vi.spyOn(service, "get_all").mockResolvedValue(expected);

      const result = await controller.get_all();

      expect(result).toBe(expected);
      expect(service.get_all).toHaveBeenCalledTimes(1);
    });

    it("should propagate NotFoundException when no diseases found", async () => {
      vi.spyOn(service, "get_all").mockRejectedValue(new NotFoundException("Not found"));

      await expect(controller.get_all()).rejects.toThrow(NotFoundException);
    });
  });

  describe("get_one", () => {
    it("should return one disease by id", async () => {
      const expected = { id: "uuid-1", type_id: "type-uuid-1" };

      vi.spyOn(service, "get_one").mockResolvedValue(expected);

      const result = await controller.get_one("uuid-1");

      expect(result).toBe(expected);
      expect(service.get_one).toHaveBeenCalledWith({ id: "uuid-1" });
    });

    it("should propagate NotFoundException when disease not found", async () => {
      vi.spyOn(service, "get_one").mockRejectedValue(new NotFoundException("Not found"));

      await expect(controller.get_one("uuid-not-found")).rejects.toThrow(NotFoundException);
    });
  });
});
