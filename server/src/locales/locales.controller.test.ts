import { LocalesController } from "./locales.controller";
import { LocalesService } from "./locales.service";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { NotFoundException } from "@nestjs/common";

describe("LocalesController", () => {
  let controller: LocalesController;
  let service: Partial<LocalesService>;

  beforeEach(() => {
    service = {
      get_all: vi.fn(),
      get_one: vi.fn(),
    };

    controller = new LocalesController(service as LocalesService);
  });

  describe("get_all", () => {
    it("should return all locales", async () => {
      const expected = [
        { id: "uuid-1", code: "fr" },
        { id: "uuid-2", code: "en" },
      ];

      vi.spyOn(service, "get_all").mockResolvedValue(expected);

      const result = await controller.get_all();

      expect(result).toBe(expected);
      expect(service.get_all).toHaveBeenCalledTimes(1);
    });
  });

  describe("get_one", () => {
    it("should return one locale by id", async () => {
      const expected = { id: "uuid-1", code: "fr" };

      vi.spyOn(service, "get_one").mockResolvedValue(expected);

      const result = await controller.get_one("uuid-1");

      expect(result).toBe(expected);
      expect(service.get_one).toHaveBeenCalledWith({ id: "uuid-1" });
    });

    it("should propagate NotFoundException when locale not found", async () => {
      vi.spyOn(service, "get_one").mockRejectedValue(new NotFoundException());

      await expect(controller.get_one("uuid-not-found")).rejects.toThrow(NotFoundException);
    });
  });
});
