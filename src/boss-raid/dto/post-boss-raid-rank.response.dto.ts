import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../config/base.response';

// Admin 정보
class RankingInfo {
  @ApiProperty({
    example: 0,
    description: '랭킹',
    required: true,
  })
  ranking: number; // 랭킹 1위의 ranking 값은 0입니다.

  @ApiProperty({
    example: 1,
    description: 'userId',
    required: true,
  })
  userId: number;

  @ApiProperty({
    example: 60,
    description: '총 점수',
    required: true,
  })
  totalScore: number;
}

export abstract class PostBossRaidRankResultData {
  @ApiProperty({
    description: 'user 객체',
    type: RankingInfo,
    required: true,
    isArray: false,
  })
  topRankerInfoList: RankingInfo[];

  @ApiProperty({
    example: 30,
    description: '총 점수',
    required: true,
  })
  myRankingInfo: RankingInfo;
}

export abstract class PostBossRaidRankResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  result: PostBossRaidRankResultData;
}
