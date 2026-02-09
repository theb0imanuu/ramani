import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeterEntity } from './meter.entity';
import { MeterStatus } from '@ramani/shared';

@Injectable()
export class MetersService {
  private readonly logger = new Logger(MetersService.name);

  constructor(
    @InjectRepository(MeterEntity)
    private metersRepository: Repository<MeterEntity>,
  ) {}

  async findAll(): Promise<MeterEntity[]> {
    return this.metersRepository.find({
        order: { lastUpdated: 'DESC' }
    });
  }

  async findOne(id: string): Promise<MeterEntity | null> {
    return this.metersRepository.findOneBy({ id });
  }

  async findBySerialNumber(serialNumber: string): Promise<MeterEntity | null> {
    return this.metersRepository.findOneBy({ serialNumber });
  }

  async create(data: Partial<MeterEntity>): Promise<MeterEntity> {
    const meter = this.metersRepository.create(data);
    return this.metersRepository.save(meter);
  }

  async update(id: string, data: Partial<MeterEntity>): Promise<MeterEntity | null> {
    await this.metersRepository.update(id, data);
    return this.metersRepository.findOneBy({ id });
  }

  async updateFlowRate(serialNumber: string, flowRate: number): Promise<void> {
      const meter = await this.findBySerialNumber(serialNumber);
      if (meter) {
          meter.currentFlowRate = flowRate;
          // Simple logic: if flow > 500, marked as potentially problematic, theoretically could trigger alert here
          await this.metersRepository.save(meter);
      }
  }
}
