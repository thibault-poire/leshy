import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PlantsController } from './plants.controller';
import { PlantsService } from './plants.service';
import { NotFoundException } from '@nestjs/common';

describe('PlantsController', () => {
  let controller: PlantsController;
  let service: Partial<PlantsService>;

  beforeEach(() => {
    service = {
      get_all: vi.fn(),
      get_one: vi.fn(),
    };

    controller = new PlantsController(service as PlantsService);
  });

  describe('get_all', () => {
    it('should return all plants', async () => {
      const expected = [
        { id: 'uuid-1', binomial_name: 'Quercus robur' },
        { id: 'uuid-2', binomial_name: 'Acer saccharinum' },
      ];

      vi.spyOn(service, 'get_all').mockResolvedValue(expected);

      const result = await controller.get_all();

      expect(result).toBe(expected);
      expect(service.get_all).toHaveBeenCalledTimes(1);
    });
  });

  describe('get_one', () => {
    it('should return one plant by id', async () => {
      const expected = { id: 'uuid-1', binomial_name: 'Quercus robur' };

      vi.spyOn(service, 'get_one').mockResolvedValue(expected);

      const result = await controller.get_one('uuid-1');

      expect(result).toBe(expected);
      expect(service.get_one).toHaveBeenCalledWith({ id: 'uuid-1' });
    });

    it('should propagate NotFoundException when plant not found', async () => {
      vi.spyOn(service, 'get_one').mockRejectedValue(new NotFoundException());

      await expect(controller.get_one('uuid-not-found')).rejects.toThrow(NotFoundException);
    });
  });
});
