import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeterEntity } from './meter.entity';
import { MetersService } from './meters.service';
import { MetersController } from './meters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MeterEntity])],
  controllers: [MetersController],
  providers: [MetersService],
  exports: [MetersService],
})
export class MetersModule {}
