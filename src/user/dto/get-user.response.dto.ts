import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../config/base.response';

// Admin 정보
class BossRaidInfo {
  @ApiProperty({
    example: 1,
    description: '레이드 아이디',
    required: true,
  })
  raidRecordId: number;

  @ApiProperty({
    example: 30,
    description: '점수',
    required: true,
  })
  score: number;

  @ApiProperty({
    example: '2022-06-02 09:00',
    description: '들어간 시간',
    required: true,
  })
  enterTime: string;

  @ApiProperty({
    example: '2022-06-02 16:44',
    description: '끝난 시간',
    required: true,
  })
  endTime: string;
}

export abstract class GetUserResultData {
  @ApiProperty({
    description: 'user 객체',
    type: BossRaidInfo,
    required: true,
    isArray: false,
  })
  bossRaidHistory: BossRaidInfo;
}

export abstract class GetUserResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  result: GetUserResultData;
}
