import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IotController } from './iot.controller';
import { MetersModule } from './meters/meters.module';
import { MeterEntity } from './meters/meter.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'ramani_user', 
      password: 'password123',      
      database: 'ramani_db',
      entities: [MeterEntity],
      synchronize: true,
    }),
    MetersModule,
  ],
  controllers: [IotController],
  providers: [],
})
export class AppModule {}