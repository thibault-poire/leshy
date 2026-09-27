import { Locale } from "./entities/locale.entity";
import { LocalesService } from "./locales.service";
import { Repository, ObjectLiteral } from "typeorm";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { NotFoundException } from "@nestjs/common";

describe("LocalesService", () => {
  const repository_mock = <T extends ObjectLiteral>() =>
    ({
      delete: vi.fn(),
      find: vi.fn(),
      findBy: vi.fn(),
      findOne: vi.fn(),
      findOneBy: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    }) as unknown as Repository<T>;

  let service: LocalesService;
  let repository: Repository<Locale>;

  beforeEach(() => {
    repository = repository_mock<Locale>();

    service = new LocalesService(repository);
  });

  describe("get_all", () => {
    it("should return all locales from repository", async () => {
      const expected = [
        { id: "uuid-1", code: "fr" },
        { id: "uuid-2", code: "en" },
      ];

      vi.mocked(repository.find).mockResolvedValue(expected);

      const result = await service.get_all();

      expect(result).toBe(expected);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("get_one", () => {
    it("should return one locale by filters", async () => {
      const filters = { id: "uuid-1" };
      const expected = { id: "uuid-1", code: "fr" };

      vi.mocked(repository.findOneBy).mockResolvedValue(expected);

      const result = await service.get_one(filters);

      expect(result).toBe(expected);
      expect(repository.findOneBy).toHaveBeenCalledWith(filters);
    });

    it("should throw NotFoundException when locale not found", async () => {
      const filters = { id: "uuid-not-found" };

      vi.mocked(repository.findOneBy).mockResolvedValue(null);

      await expect(service.get_one(filters)).rejects.toBeInstanceOf(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith(filters);
    });
  });
});
