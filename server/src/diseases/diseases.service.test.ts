import { Disease } from "./entities/disease.entity";
import { DiseasesService } from "./diseases.service";
import { Repository, ObjectLiteral } from "typeorm";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { NotFoundException } from "@nestjs/common";

describe("DiseasesService", () => {
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

  let service: DiseasesService;
  let repository: Repository<Disease>;

  beforeEach(() => {
    repository = repository_mock<Disease>();

    service = new DiseasesService(repository);
  });

  describe("get_all", () => {
    it("should return all diseases from repository", async () => {
      const expected = [
        { id: "uuid-1", type_id: "type-uuid-1" },
        { id: "uuid-2", type_id: "type-uuid-2" },
      ];

      vi.mocked(repository.find).mockResolvedValue(expected);

      const result = await service.get_all();

      expect(result).toBe(expected);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("get_one", () => {
    it("should return one disease by filters", async () => {
      const filters = { id: "uuid-1" };
      const expected = { id: "uuid-1", type_id: "type-uuid-1" };

      vi.mocked(repository.findOneBy).mockResolvedValue(expected);

      const result = await service.get_one(filters);

      expect(result).toBe(expected);
      expect(repository.findOneBy).toHaveBeenCalledWith(filters);
    });

    it("should throw NotFoundException when disease not found", async () => {
      const filters = { id: "uuid-not-found" };

      vi.mocked(repository.findOneBy).mockResolvedValue(null);

      await expect(service.get_one(filters)).rejects.toThrow(NotFoundException);
    });
  });
});
