import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PlantsService } from './plants.service';
import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Plant } from './entities/plant.entity';

describe('PlantsService', () => {
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

  let service: PlantsService;
  let repository: Repository<Plant>;

  beforeEach(() => {
    repository = repository_mock<Plant>();

    service = new PlantsService(repository);
  });

  describe('get_all', () => {
    it('should return all plants from repository', async () => {
      const expected = [
        { id: 'uuid-1', binomial_name: 'Quercus robur' },
        { id: 'uuid-2', binomial_name: 'Acer saccharinum' },
      ];

      vi.mocked(repository.find).mockResolvedValue(expected);

      const result = await service.get_all();

      expect(result).toBe(expected);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('get_one', () => {
    it('should return one plant by filters', async () => {
      const filters = { id: 'uuid-1' };
      const expected = { id: 'uuid-1', binomial_name: 'Quercus robur' };

      vi.mocked(repository.findOneBy).mockResolvedValue(expected);

      const result = await service.get_one(filters);

      expect(result).toBe(expected);
      expect(repository.findOneBy).toHaveBeenCalledWith(filters);
    });

    it('should throw NotFoundException when plant not found', async () => {
      const filters = { id: 'uuid-not-found' };

      vi.mocked(repository.findOneBy).mockResolvedValue(null);

      await expect(service.get_one(filters)).rejects.toBeInstanceOf(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith(filters);
    });
  });
});
