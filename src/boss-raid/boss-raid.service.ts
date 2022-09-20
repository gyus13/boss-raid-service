import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { response } from '../common/response.utils';
import {
  defaultCurrentDateTime,
  defaultThreeMinuteDateTime,
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
      let raidData = {
        bossRaidLimitSeconds: await this.cacheManager.get(
          'bossRaidLimitSeconds',
        ),
        levels: await this.cacheManager.get('levels'),
      };

      // static data 캐시 메모리 적재 함수
      if (!raidData.levels) {
        await this.getStaticData();

        raidData = {
          bossRaidLimitSeconds: await this.cacheManager.get(
            'bossRaidLimitSeconds',
          ),
          levels: JSON.parse(await this.cacheManager.get('levels')),
        };
      }

      raidData.levels.forEach((object) => {
        if (object.level == postBossRaidRequest.level) {
          console.log('level:', object.score);
          const raidLevel = object.level;
          const raidScore = object.score;
        }
      });

      // User 인스턴스 생성후, 정보 담는 부분
      const bossRaidRecord = new BossRaidRecordEntity();
      bossRaidRecord.userId = postBossRaidRequest.userId;
      bossRaidRecord.createdAt = defaultCurrentDateTime();
      bossRaidRecord.updatedAt = defaultCurrentDateTime();
      bossRaidRecord.status = Status.ACTIVE;
      bossRaidRecord.enterTime = defaultCurrentDateTime();
      bossRaidRecord.canEnter = false;
      bossRaidRecord.endTime = null;
      bossRaidRecord.level = null;
      bossRaidRecord.score = null;
      bossRaidRecord.expireTime = defaultThreeMinuteDateTime(
        raidData.bossRaidLimitSeconds,
      );
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
        { ttl: 180 },
      );

      await this.cacheManager.set('levels', JSON.stringify(raidInfo.levels), {
        ttl: 180,
      });

      const { condition } = await resData.data.current;
      return condition.text;
    } catch (error) {
      console.error(error.message);
    }
  }
}
