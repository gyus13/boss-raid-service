import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { response } from '../common/response.utils';
import {defaultCurrentDateTime, defaultThreeMinuteDateTime, makeResponse} from '../config/function.utils';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { BossRaidEntity } from '../entity/boss-raid.entity';
import { PostBossRaidRequest } from './dto/post-boss-raid.request.dto';
import { BossRaidRecordEntity } from '../entity/boss-raid-record.entity';
import { firstValueFrom } from 'rxjs';
import {Status} from "../config/valuable.utils";

@Injectable()
export class BossRaidService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BossRaidEntity)
    private readonly bossRaidRepository: Repository<BossRaidEntity>,
    private readonly httpService: HttpService,
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
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      // 입력한 번호에 해당하는 유저값 추출
      const findBossRaidIdByLevel = await this.bossRaidRepository.findOne({
        where: {
          level: postBossRaidRequest.level,
        },
      });

      // static data 캐시 메모리 적재
      await this.getStaticData();

      const CacheData = await this.cacheManager.get('key');

      console.log(CacheData);

      // User 인스턴스 생성후, 정보 담는 부분
      const bossRaidRecord = new BossRaidRecordEntity();
      bossRaidRecord.userId = postBossRaidRequest.userId;
      bossRaidRecord.bossRaidId = findBossRaidIdByLevel.id;
      bossRaidRecord.createdAt = defaultCurrentDateTime();
      bossRaidRecord.updatedAt = defaultCurrentDateTime();
      bossRaidRecord.status = Status.ACTIVE;
      bossRaidRecord.enterTime = defaultCurrentDateTime();
      bossRaidRecord.expireTime = defaultThreeMinuteDateTime();
      const bossRaidRecordData = await queryRunner.manager.save(bossRaidRecord);

      // 키값 초기화
      await this.cacheManager.del('key');

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

  async closeBossRaid(patchBossRaidRequest) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 입력한 번호에 해당하는 유저값 추출
      // const findBossRaidIdByLevel = await this.bossRaidRepository.findOne({
      //   where: {
      //     level: postBossRaidRequest.level,
      //   },
      // });

      // board 수정
      await queryRunner.manager.update(
        BossRaidRecordEntity,
        {
          userId: patchBossRaidRequest.userId,
          raidRecordId: patchBossRaidRequest.raidRecordId,
        },
        { canEnter: true },
      );

      // Response의 result 객체에 Data를 담는 부분
      const data = {};

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

  async getStaticData(): Promise<string> {
    try {
      const resData = await firstValueFrom(
        this.httpService.get(
          `https://dmpilf5svl7rv.cloudfront.net/assignment/backend/bossRaidData.json`,
        ),
      );

      // 키값 초기화
      await this.cacheManager.del('key');

      const { condition } = await resData.data.current;

      // Data를 캐시에 만료시간 180초으로 설정하여 저장
      await this.cacheManager.set('key', resData, {
        ttl: 180,
      });

      return condition.text;
    } catch (error) {
      console.error(error.message);
    }
  }
}
