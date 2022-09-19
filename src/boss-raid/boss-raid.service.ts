import { Injectable } from '@nestjs/common';
import { response } from '../common/response.utils';
import { makeResponse } from '../config/function.utils';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { BossRaidEntity } from '../entity/boss-raid.entity';
import { PostBossRaidRequest } from './dto/post-boss-raid.request.dto';
import { BossRaidRecordEntity } from '../entity/boss-raid-record.entity';

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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Response의 result 객체에 Data를 담는 부분
      const data = {
        canEnter: 'number',
        enteredUserId: 1,
      };

      const result = makeResponse(response.SUCCESS, data);

      // Commit
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      // Rollback
      await queryRunner.rollbackTransaction();
      console.log(error);
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }

  async createBossRaid(postBossRaidRequest: PostBossRaidRequest) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 입력한 번호에 해당하는 유저값 추출
      const findBossRaidIdByLevel = await this.bossRaidRepository.findOne({
        where: {
          level: postBossRaidRequest.level,
        },
      });

      // User 인스턴스 생성후, 정보 담는 부분
      const bossRaidRecord = new BossRaidRecordEntity();
      bossRaidRecord.userId = postBossRaidRequest.userId;
      bossRaidRecord.bossRaidId = findBossRaidIdByLevel.id;
      // bossRaidRecord.enterTime = ''
      const bossRaidRecordData = await queryRunner.manager.save(bossRaidRecord);

      // Response의 result 객체에 Data를 담는 부분
      const data = {
        isEntered: 'boolean',
        raidRecordId: bossRaidRecordData.id,
      };

      const result = makeResponse(response.SUCCESS, data);

      // Commit
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      // Rollback
      await queryRunner.rollbackTransaction();
      console.log(error);
      return response.ERROR;
    } finally {
      await queryRunner.release();
    }
  }
}
