import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class UserEntity extends CommonEntity {
}
