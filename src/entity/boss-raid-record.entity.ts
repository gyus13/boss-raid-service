import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

@Entity('boss_raid_record')
export class BossRaidRecordEntity extends CommonEntity {
  @ApiProperty()
  @Column()
  enterTime: string;

  @ApiProperty()
  @Column({ nullable: true })
  endTime: string;

  @ApiProperty()
  @Column()
  expireTime: string;

  @ApiProperty()
  @Column()
  canEnter: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  level: number;

  @ApiProperty()
  @Column({ nullable: true })
  score: number;

  @ApiProperty({ description: '유저' })
  @Column()
  userId: number;
}
