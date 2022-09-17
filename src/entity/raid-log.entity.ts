import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('raid_log')
export class RaidLogEntity extends CommonEntity {
  @ApiProperty()
  @Column()
  type: string;

  @ApiProperty()
  @Column()
  percent: string;

  @ApiProperty()
  @Column()
  price: string;


}
