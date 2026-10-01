import { Plant } from "./entities/plant.entity";
import { PlantsService } from "./plants.service";
import { Repository, ObjectLiteral } from "typeorm";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { NotFoundException } from "@nestjs/common";

describe("PlantsService", () => {
  const repository_mock = <T extends ObjectLiteral>() =>
    ({
      create: vi.fn(),
      delete: vi.fn(),
      find: vi.fn(),
      findBy: vi.fn(),
      findOne: vi.fn(),
      findOneBy: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    }) as unknown as Repository<T>;

  let service: PlantsService;
  let repository: Repository<Plant>;

  beforeEach(() => {
    repository = repository_mock<Plant>();

    service = new PlantsService(repository);
  });

  describe("get_all", () => {
    it("should return all plants from repository", async () => {
      const expected = [
        { id: "uuid-1", binomial_name: "Quercus robur" },
        { id: "uuid-2", binomial_name: "Acer saccharinum" },
      ];

      vi.mocked(repository.find).mockResolvedValue(expected);

      const result = await service.get_all();

      expect(result).toBe(expected);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("get_one", () => {
    it("should return one plant by filters", async () => {
      const filters = { id: "uuid-1" };
      const expected = { id: "uuid-1", binomial_name: "Quercus robur" };

      vi.mocked(repository.findOneBy).mockResolvedValue(expected);

      const result = await service.get_one(filters);

      expect(result).toBe(expected);
      expect(repository.findOneBy).toHaveBeenCalledWith(filters);
    });

    it("should throw NotFoundException when plant not found", async () => {
      const filters = { id: "uuid-not-found" };

      vi.mocked(repository.findOneBy).mockResolvedValue(null);

      await expect(service.get_one(filters)).rejects.toBeInstanceOf(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith(filters);
    });
  });

  describe("add_one", () => {
    it("should create and save a new plant", async () => {
      const dto = { binomial_name: "Quercus robur" };
      const created = { id: "uuid-1", binomial_name: "Quercus robur" };

      vi.mocked(repository.create).mockReturnValue(created);
      vi.mocked(repository.save).mockResolvedValue(created);

      const result = await service.add_one(dto);

      expect(result).toBe(created);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(created);
    });
  });

  describe("update_one", () => {
    it("should update and save an existing plant", async () => {
      const existing = { id: "uuid-1", binomial_name: "Quercus robur" };
      const dto = { binomial_name: "Quercus petraea" };
      const expected = { id: "uuid-1", binomial_name: "Quercus petraea" };

      vi.mocked(repository.findOneBy).mockResolvedValue(existing);
      vi.mocked(repository.save).mockResolvedValue(expected);

      const result = await service.update_one("uuid-1", dto);

      expect(result).toBe(expected);
      expect(repository.save).toHaveBeenCalledWith(expected);
    });

    it("should throw NotFoundException when plant not found", async () => {
      vi.mocked(repository.findOneBy).mockResolvedValue(null);

      await expect(
        service.update_one("uuid-not-found", { binomial_name: "Quercus petraea" }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("patch_one", () => {
    it("should patch and save an existing plant", async () => {
      const existing = { id: "uuid-1", binomial_name: "Quercus robur" };
      const dto = { binomial_name: "Quercus petraea" };
      const expected = { id: "uuid-1", binomial_name: "Quercus petraea" };

      vi.mocked(repository.findOneBy).mockResolvedValue(existing);
      vi.mocked(repository.save).mockResolvedValue(expected);

      const result = await service.patch_one("uuid-1", dto);

      expect(result).toBe(expected);
      expect(repository.save).toHaveBeenCalledWith(expected);
    });

    it("should throw NotFoundException when plant not found", async () => {
      vi.mocked(repository.findOneBy).mockResolvedValue(null);

      await expect(
        service.patch_one("uuid-not-found", { binomial_name: "Quercus petraea" }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("delete_one", () => {
    it("should delete an existing plant", async () => {
      const existing = { id: "uuid-1", binomial_name: "Quercus robur" };

      vi.mocked(repository.findOneBy).mockResolvedValue(existing);
      vi.mocked(repository.delete).mockResolvedValue({ affected: 1, raw: [] });

      await service.delete_one("uuid-1");

      expect(repository.delete).toHaveBeenCalledWith("uuid-1");
    });

    it("should throw NotFoundException when plant not found", async () => {
      vi.mocked(repository.findOneBy).mockResolvedValue(null);

      await expect(service.delete_one("uuid-not-found")).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
