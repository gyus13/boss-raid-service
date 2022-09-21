import { Injectable } from '@nestjs/common';
import { response } from '../common/response.utils';
import { makeResponse } from '../config/function.utils';
import { UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BossRaidRecordEntity } from '../entity/boss-raid-record.entity';

@Injectable()
export class UserService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // User 인스턴스 생성후, 정보 담는 부분
      const user = new UserEntity();
      const createUserData = await queryRunner.manager.save(user);

      // Response의 result 객체에 Data를 담는 부분
      const data = {
        id: createUserData.id,
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

  async retrieveUserByUserId(id) {
    try {
      // 입력한 번호에 해당하는 유저값 추출
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });

      // 존재하지 않는 유저 체크
      if (user == undefined) {
        return response.NON_EXIST_USER;
      }

      const totalScore = await this.dataSource
        .createQueryBuilder(BossRaidRecordEntity, 'bossRaidRecord')
        .select('SUM(bossRaidRecord.score)', 'sum')
        .where('bossRaidRecord.userId = :userId', { userId: 1 })
        .getRawOne();

      const bossRaidHistory = await this.dataSource
        .createQueryBuilder(BossRaidRecordEntity, 'bossRaidRecord')
        .where('userId IN (:userId)', {
          userId: id,
        })
        .select([
          'bossRaidRecord.id',
          'bossRaidRecord.score',
          'bossRaidRecord.enterTime',
          'bossRaidRecord.endTime',
        ])
        .getMany();

      // Response의 result 객체에 Data를 담는 부분
      const data = {
        totalScore: Number(totalScore.sum),
        bossRaidHistory: bossRaidHistory,
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
