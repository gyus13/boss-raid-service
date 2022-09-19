import {Body, Controller, Get, Param, Patch, Post} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BossRaidService } from './boss-raid.service';
import { GetBossRaidResponse } from './dto/get-boss-raid.response.dto';
import { PostBossRaidRequest } from './dto/post-boss-raid.request.dto';
import { PostBossRaidResponse } from './dto/post-boss-raid.response.dto';
import { PatchBossRaidRequest } from './dto/patch-boss-raid.request.dto';

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
    type: GetBossRaidResponse,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '보스레이드 상태 조회 API' })
  @Get()
  async getBossRaid() {
    return await this.bossRaidService.retrieveBossRaidStatus();
  }

  /**
   * description : 보스레이드 시작 API
   * @returns non
   * @param postOrderRequestDto
   */
  @ApiResponse({
    status: 200,
    description: '성공',
    type: PostBossRaidResponse,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '보스레이드 시작 API' })
  @ApiBody({
    description: '보스 레이드 시작 DTO',
    type: PostBossRaidRequest,
  })
  @Post('/enter')
  async postBossRaid(@Body() postBossRaidRequest: PostBossRaidRequest) {
    return await this.bossRaidService.createBossRaid(postBossRaidRequest);
  }

  /**
   * description : 보스레이드 종료 API
   * @param non
   * @returns non
   */
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '보스레이드 종료 API' })
  @Patch('/end')
  @ApiBody({
    description: '보스레이드 종료 DTO',
    type: PatchBossRaidRequest,
  })
  async patchBossRaid(@Body() patchBossRaidRequest: PatchBossRaidRequest) {
    return await this.bossRaidService.closeBossRaid(patchBossRaidRequest);
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
  async getBossRaidRankList() {
    // return await this.userService.retrieveRankList();
  }
}
