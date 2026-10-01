import { Type } from "./entities/type.entity";
import { TypesService } from "./types.service";
import { Repository, ObjectLiteral } from "typeorm";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { NotFoundException } from "@nestjs/common";

describe("TypesService", () => {
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

  let service: TypesService;
  let repository: Repository<Type>;

  beforeEach(() => {
    repository = repository_mock<Type>();

    service = new TypesService(repository);
  });

  describe("get_all", () => {
    it("should return all types from repository", async () => {
      const expected = [{ id: "uuid-1" }, { id: "uuid-2" }];

      vi.mocked(repository.find).mockResolvedValue(expected);

      const result = await service.get_all();

      expect(result).toBe(expected);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("get_one", () => {
    it("should return one type by filters", async () => {
      const filters = { id: "uuid-1" };
      const expected = { id: "uuid-1" };

      vi.mocked(repository.findOneBy).mockResolvedValue(expected);

      const result = await service.get_one(filters);

      expect(result).toBe(expected);
      expect(repository.findOneBy).toHaveBeenCalledWith(filters);
    });

    it("should throw NotFoundException when type not found", async () => {
      const filters = { id: "uuid-not-found" };

      vi.mocked(repository.findOneBy).mockResolvedValue(null);

      await expect(service.get_one(filters)).rejects.toThrow(NotFoundException);
    });
  });
});
