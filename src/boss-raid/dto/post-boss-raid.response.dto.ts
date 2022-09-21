import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../config/base.response';
export abstract class PostBossRaidResultData {
  @ApiProperty({
    example: 'N',
    description: '현재 입장 여부',
    required: true,
  })
  isEntered: boolean;

  @ApiProperty({
    example: 1,
    description: 'raid record id',
    required: true,
  })
  raidRecordId: number;
}

export abstract class PostBossRaidResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  result: PostBossRaidResultData;
}
