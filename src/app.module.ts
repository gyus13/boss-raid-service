import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { BossRaidModule } from './boss-raid/boss-raid.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'RECRUIT',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      timezone: 'Asia/Seoul',
    }),
    UserModule,
    BossRaidModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
