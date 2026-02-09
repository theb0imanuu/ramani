import { Controller, Get, Post, Body, Param, Patch, NotFoundException } from '@nestjs/common';
import { MetersService } from './meters.service';
import { MeterEntity } from './meter.entity';

@Controller('meters')
export class MetersController {
  constructor(private readonly metersService: MetersService) {}

  @Get()
  findAll() {
    return this.metersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const meter = await this.metersService.findOne(id);
    if (!meter) throw new NotFoundException('Meter not found');
    return meter;
  }

  @Post()
  create(@Body() body: Partial<MeterEntity>) {
    return this.metersService.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: Partial<MeterEntity>) {
    const updated = await this.metersService.update(id, body);
    if (!updated) throw new NotFoundException('Meter not found');
    return updated;
  }
}
