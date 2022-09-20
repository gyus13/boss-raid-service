import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';
import {UserEntity} from "./user.entity";

@Entity('ranking')
export class RankingEntity extends CommonEntity {
  @ApiProperty({ description: '유저' })
  @ManyToOne(() => UserEntity, { eager: true })
  userId: number;

  @ApiProperty()
  @Column()
  rank: string;

  @ApiProperty()
  @Column()
  totalScore: string;
}
