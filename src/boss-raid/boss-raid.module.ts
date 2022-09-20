import { CacheModule, Module } from '@nestjs/common';
import { BossRaidController } from './boss-raid.controller';
import { BossRaidService } from './boss-raid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { BossRaidRecordEntity } from '../entity/boss-raid-record.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    CacheModule.register(),
    HttpModule,
    TypeOrmModule.forFeature([
      UserEntity,
      BossRaidRecordEntity,
    ]),
  ],
  controllers: [BossRaidController],
  providers: [BossRaidService],
})
export class BossRaidModule {}
