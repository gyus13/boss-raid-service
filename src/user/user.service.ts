import { Injectable } from '@nestjs/common';
import { response } from '../common/response.utils';
import { makeResponse } from '../config/function.utils';
import { UserEntity } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

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
}
