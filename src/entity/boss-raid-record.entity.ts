import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

@Entity('boss_raid_record')
export class BossRaidRecordEntity extends CommonEntity {
  @ApiProperty({ nullable: true, type: 'timestamp' })
  @Column()
  enterTime: Date;

  @ApiProperty()
  @Column({ nullable: true, type: 'timestamp' })
  endTime: Date;

  @ApiProperty()
  @Column({ nullable: true, type: 'timestamp' })
  expireTime: Date;

  @ApiProperty()
  @Column({ nullable: true })
  score: number;

  @ApiProperty()
  @Column({ nullable: true })
  level: number;

  @ApiProperty({ description: '유저' })
  @Column()
  userId: number;
}
