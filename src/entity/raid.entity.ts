import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from './user.entity';
import { RaidLogEntity } from './raid-log.entity';

@Entity('raid')
export class RiadEntity extends CommonEntity {
  @ApiProperty()
  @Column()
  endedAt: string;

  @ApiProperty()
  @Column()
  deliveryStatus: string;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty({ description: '주문자' })
  @ManyToOne(() => UserEntity, { eager: true })
  userId: number;

  @ApiProperty({ description: '쿠폰' })
  @ManyToOne(() => RaidLogEntity, { eager: true })
  couponId: number;
}
