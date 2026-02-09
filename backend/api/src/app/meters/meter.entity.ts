import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { MeterStatus } from '@ramani/shared';

@Entity('meters')
export class MeterEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  serialNumber: string;

  // PostGIS: Stores location as a geometric point
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326, 
    nullable: true,
  })
  location: string; 

  @Column({
    type: 'enum',
    enum: MeterStatus,
    default: MeterStatus.ACTIVE,
  })
  status: MeterStatus;

  @Column('float', { default: 0 })
  currentFlowRate: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;
}