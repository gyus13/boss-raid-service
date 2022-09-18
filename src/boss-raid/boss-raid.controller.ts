import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BossRaidService } from './boss-raid.service';

@Controller('bossRaid')
export class BossRaidController {
  constructor(private readonly bossRaidService: BossRaidService) {}

  /**
   * description : 보스레이드 상태 조회 API
   * @param non
   * @returns
   */
  @ApiResponse({
    status: 200,
    description: '성공',
    // type: PostUserResponse,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '보스레이드 상태 조회 API' })
  @Get()
  async getBossRaid() {
    // return await this.userService.retrieveUserByUserId(id);
  }

  /**
   * description : 보스레이드 시작 API
   * @param non
   * @returns non
   */
  @ApiResponse({
    status: 200,
    description: '성공',
    // type: PostUserResponse,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '보스레이드 시작 API' })
  @Post('/enter')
  async postBossRaid() {
    // return await this.userService.createUser();
  }

  /**
   * description : 보스레이드 시작 API
   * @param non
   * @returns non
   */
  @ApiResponse({
    status: 200,
    description: '성공',
    // type: PostUserResponse,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '보스레이드 시작 API' })
  @Post('/enter')
  async postBossRaid() {
    // return await this.userService.createUser();
  }

  /**
   * description : 보스레이드 종료 API
   * @param non
   * @returns non
   */
  @ApiResponse({
    status: 200,
    description: '성공',
    // type: PostUserResponse,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '보스레이드 종료 API' })
  @Patch('/end')
  async patchBossRaid() {
    // return await this.userService.createUser();
  }

  /**
   * description : 보스레이드 랭킹 조회 API
   * @param non
   * @returns non
   */
  @ApiResponse({
    status: 200,
    description: '성공',
    // type: PostUserResponse,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '보스레이드 랭킹 조회 API' })
  @Get('/topRankerList')
  async getBossRaidRank() {
    // return await this.userService.createUser();
  }
}
