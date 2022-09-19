import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { BossRaidEntity } from './boss-raid.entity';

@Entity('boss_raid_record')
export class BossRaidRecordEntity extends CommonEntity {
  @ApiProperty()
  @Column()
  endTime: string;

  @ApiProperty()
  @Column()
  canEnter: boolean;

  @ApiProperty({ description: '유저' })
  @ManyToOne(() => UserEntity, { eager: true })
  userId: number;

  @ApiProperty({ description: '보스 레이드' })
  @ManyToOne(() => BossRaidEntity, { eager: true })
  bossRaidId: number;
}
