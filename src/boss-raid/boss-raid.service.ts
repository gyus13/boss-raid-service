import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { response } from '../common/response.utils';
import {
  defaultCurrentDateTime,
  defaultThreeMinuteDateTime,
  generateDateFormatComponent,
  makeResponse,
} from '../config/function.utils';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { PostBossRaidRequest } from './dto/post-boss-raid.request.dto';
import { BossRaidRecordEntity } from '../entity/boss-raid-record.entity';
import { firstValueFrom } from 'rxjs';
import { Status } from '../config/valuable.utils';

@Injectable()
export class BossRaidService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(BossRaidRecordEntity)
    private readonly bossRaidRecordRepository: Repository<BossRaidRecordEntity>,
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
      let raidDatas = {
        bossRaidLimitSeconds: await this.cacheManager.get(
          'bossRaidLimitSeconds',
        ),
        levels: await this.cacheManager.get('levels'),
      };

      // static data 캐시 메모리 적재 함수
      if (!raidDatas.levels) {
        await this.getStaticData();

        raidDatas = {
          bossRaidLimitSeconds: await this.cacheManager.get(
            'bossRaidLimitSeconds',
          ),
          levels: JSON.parse(await this.cacheManager.get('levels')),
        };
      }

      const raidData = raidDatas.levels.find(
        (data) => data.level === postBossRaidRequest.level,
      );

      const currentTime = generateDateFormatComponent();

      const recentData = await queryRunner.manager.find(BossRaidRecordEntity, {
        order: { enterTime: 'DESC' },
        take: 1,
      });

      if (
        recentData[0] === undefined ||
        recentData[0].expireTime < currentTime
      ) {
        const enterTime = currentTime;
        const expireTime = defaultCurrentDateTime(currentTime, raidDatas);
        // User 인스턴스 생성후, 정보 담는 부분
        const bossRaidRecord = new BossRaidRecordEntity();
        bossRaidRecord.userId = postBossRaidRequest.userId;
        bossRaidRecord.status = Status.ACTIVE;
        bossRaidRecord.enterTime = enterTime;
        bossRaidRecord.endTime = null;
        bossRaidRecord.expireTime = expireTime;
        bossRaidRecord.level = raidData.level;
        bossRaidRecord.score = null;
        const bossRaidRecordData = await queryRunner.manager.save(
          bossRaidRecord,
        );

        // Response의 result 객체에 Data를 담는 부분
        const data = {
          isEntered: 'true',
          raidRecordId: bossRaidRecordData.id,
        };

        const result = makeResponse(response.SUCCESS, data);

        // Commit
        await queryRunner.commitTransaction();

        return result;
      } else {
        return response.NOT_ACCESS_RAID;
      }
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
    await queryRunner.startTransaction('READ COMMITTED');
    try {
      // raid 데이터 캐시메모리에서 가져오기
      const raidDatas = {
        levels: await this.cacheManager.get('levels'),
      };

      const raidData = raidDatas.levels.find(
        (data) => data.level === patchBossRaidRequest.level,
      );

      // 입력한 userId에 해당하는 값 추출
      const raidRecord = await this.bossRaidRecordRepository.findOne({
        where: {
          id: patchBossRaidRequest.raidRecordId,
        },
      });

      // 해당하는 RaidRecord 예외처리
      if (!raidRecord) {
        return response.NON_EXIST_RAID_RECORD;
      }

      // UserId와 dto userId 비교후 예외처리
      if (!raidRecord.userId !== patchBossRaidRequest.userId) {
        return response.NON_EXIST_USER;
      }

      // 레이드 제한시간 비교 후 예외처리
      const endTime = generateDateFormatComponent();
      if (raidRecord.endTime < endTime) {
        return response.FAIL_RAID;
      }

      // 레이드 종료시간, score 업데이트
      await queryRunner.manager.update(
        BossRaidRecordEntity,
        {
          id: raidRecord.id,
        },
        { endTime: endTime },
      );

      await queryRunner.manager.update(
        BossRaidRecordEntity,
        {
          id: raidRecord.id,
        },
        { score: raidData.score },
      );

      // 유저 점수 종합 후 캐시 메모리 적재
      const totalScore = await this.dataSource
        .createQueryBuilder(BossRaidRecordEntity, 'bossRaidRecord')
        .select('SUM(bossRaidRecord.score)', 'sum')
        .where('bossRaidRecord.userId = :userId', {
          userId: patchBossRaidRequest.userId,
        })
        .getRawOne();

      const cacheTotalScore = totalScore + raidData.score;

      // 어떻게 랭킹을 넣을지?
      const rankingInfo = {
        userId: patchBossRaidRequest.userId,
        totalScore: cacheTotalScore,
      };

      await this.cacheManager.set(
        `rank${patchBossRaidRequest.userId}`,
        rankingInfo,
        {
          ttl: 10000,
        },
      );

      // Response의 result 객체에 Data를 담는 부분
      const data = {};

      const result = makeResponse(response.SUCCESS, data);

      // Commit
      await queryRunner.commitTransaction();

      // 키값 초기화
      await this.cacheManager.del('levels');
      await this.cacheManager.del('bossRaidLimitSeconds');

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
      // 키값 초기화
      await this.cacheManager.del('bossRaidLimitSeconds');
      await this.cacheManager.del('levels');

      const resData = await firstValueFrom(
        this.httpService.get(
          `https://dmpilf5svl7rv.cloudfront.net/assignment/backend/bossRaidData.json`,
        ),
      );

      const raidInfo = resData.data.bossRaids[0];

      await this.cacheManager.set(
        'bossRaidLimitSeconds',
        String(raidInfo.bossRaidLimitSeconds),
        { ttl: 1800 },
      );

      await this.cacheManager.set('levels', JSON.stringify(raidInfo.levels), {
        ttl: 1800,
      });

      const { condition } = await resData.data.current;
      return condition.text;
    } catch (error) {
      console.error(error.message);
    }
  }
}
