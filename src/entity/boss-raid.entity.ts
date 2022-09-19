import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('boss-raid')
export class BossRaidEntity extends CommonEntity {
  @ApiProperty()
  @Column()
  endedAt: string;

  @ApiProperty()
  @Column()
  deliveryStatus: string;

  @ApiProperty()
  @Column()
  price: number;
}
