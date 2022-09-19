import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('boss-raid')
export class BossRaidEntity extends CommonEntity {
  @ApiProperty()
  @Column()
  bossRaidLimitSeconds: number;

  @ApiProperty()
  @Column()
  level: number;

  @ApiProperty()
  @Column()
  score: number;
}
