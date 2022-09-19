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
      // 입력한 번호에 해당하는 유저값 추출
      const bossRaidRecord = await this.bossRaidRepository.find();

      // 존재하지 않는 유저 체크
      if (bossRaidRecord == undefined) {
        return response.NON_EXIST_USER;
      }

      // Response의 result 객체에 Data를 담는 부분
      const data = {
        totalScore: 'number',
        // bossRaidHistory:
        // { raidRecordId:number, score:number, enterTime:string, endTime:string },
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
