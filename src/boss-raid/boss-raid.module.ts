import { CacheModule, Module } from '@nestjs/common';
import { BossRaidController } from './boss-raid.controller';
import { BossRaidService } from './boss-raid.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [BossRaidController],
  providers: [BossRaidService],
})
export class BossRaidModule {}
