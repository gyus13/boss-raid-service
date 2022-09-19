import { Injectable } from '@nestjs/common';
import { response } from '../common/response.utils';
import { makeResponse } from '../config/function.utils';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { BossRaidEntity } from '../entity/boss-raid.entity';

@Injectable()
export class BossRaidService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BossRaidEntity)
    private readonly bossRaidRepository: Repository<BossRaidEntity>,
  ) {}

  async retrieveBossRaidStatus() {
    try {
      // Response의 result 객체에 Data를 담는 부분
      const data = {
        canEnter: 'number',
        enteredUserId: 1,
      };

      const result = makeResponse(response.SUCCESS, data);

      // Commit

      return result;
    } catch (error) {
      // Rollback
      console.log(error);
      return response.ERROR;
    }
  }
}
