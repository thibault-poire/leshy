import { PlantsController } from "./plants.controller";
import { PlantsService } from "./plants.service";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { NotFoundException } from "@nestjs/common";

describe("PlantsController", () => {
  let controller: PlantsController;
  let service: Partial<PlantsService>;

  beforeEach(() => {
    service = {
      get_all: vi.fn(),
      get_one: vi.fn(),
      add_one: vi.fn(),
      update_one: vi.fn(),
      patch_one: vi.fn(),
      delete_one: vi.fn(),
    };

    controller = new PlantsController(service as PlantsService);
  });

  describe("get_all", () => {
    it("should return all plants", async () => {
      const expected = [
        { id: "uuid-1", binomial_name: "Quercus robur" },
        { id: "uuid-2", binomial_name: "Acer saccharinum" },
      ];

      vi.spyOn(service, "get_all").mockResolvedValue(expected);

      const result = await controller.get_all();

      expect(result).toBe(expected);
      expect(service.get_all).toHaveBeenCalledTimes(1);
    });
  });

  describe("get_one", () => {
    it("should return one plant by id", async () => {
      const expected = { id: "uuid-1", binomial_name: "Quercus robur" };

      vi.spyOn(service, "get_one").mockResolvedValue(expected);

      const result = await controller.get_one("uuid-1");

      expect(result).toBe(expected);
      expect(service.get_one).toHaveBeenCalledWith({ id: "uuid-1" });
    });

    it("should propagate NotFoundException when plant not found", async () => {
      vi.spyOn(service, "get_one").mockRejectedValue(new NotFoundException());

      await expect(controller.get_one("uuid-not-found")).rejects.toThrow(NotFoundException);
    });
  });

  describe("add_one", () => {
    it("should return the created plant", async () => {
      const dto = { binomial_name: "Quercus robur" };
      const expected = { id: "uuid-1", binomial_name: "Quercus robur" };

      vi.spyOn(service, "add_one").mockResolvedValue(expected);

      const result = await controller.add_one(dto);

      expect(result).toBe(expected);
      expect(service.add_one).toHaveBeenCalledWith(dto);
    });

    it("should propagate errors when creation fails", async () => {
      const dto = { binomial_name: "Quercus robur" };

      vi.spyOn(service, "add_one").mockRejectedValue(new Error());

      await expect(controller.add_one(dto)).rejects.toThrow(Error);
    });
  });

  describe("update_one", () => {
    it("should return the updated plant", async () => {
      const dto = { binomial_name: "Quercus petraea" };
      const expected = { id: "uuid-1", binomial_name: "Quercus petraea" };

      vi.spyOn(service, "update_one").mockResolvedValue(expected);

      const result = await controller.update_one("uuid-1", dto);

      expect(result).toBe(expected);
      expect(service.update_one).toHaveBeenCalledWith("uuid-1", dto);
    });

    it("should propagate NotFoundException when plant not found", async () => {
      vi.spyOn(service, "update_one").mockRejectedValue(new NotFoundException());

      await expect(
        controller.update_one("uuid-not-found", { binomial_name: "Quercus petraea" }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("patch_one", () => {
    it("should return the patched plant", async () => {
      const dto = { binomial_name: "Quercus petraea" };
      const expected = { id: "uuid-1", binomial_name: "Quercus petraea" };

      vi.spyOn(service, "patch_one").mockResolvedValue(expected);

      const result = await controller.patch_one("uuid-1", dto);

      expect(result).toBe(expected);
      expect(service.patch_one).toHaveBeenCalledWith("uuid-1", dto);
    });

    it("should propagate NotFoundException when plant not found", async () => {
      vi.spyOn(service, "patch_one").mockRejectedValue(new NotFoundException());

      await expect(
        controller.patch_one("uuid-not-found", { binomial_name: "Quercus petraea" }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("delete_one", () => {
    it("should delete the plant by id", async () => {
      vi.spyOn(service, "delete_one").mockResolvedValue(undefined);

      await controller.delete_one("uuid-1");

      expect(service.delete_one).toHaveBeenCalledWith("uuid-1");
    });

    it("should propagate NotFoundException when plant not found", async () => {
      vi.spyOn(service, "delete_one").mockRejectedValue(new NotFoundException());

      await expect(controller.delete_one("uuid-not-found")).rejects.toThrow(NotFoundException);
    });
  });
});
