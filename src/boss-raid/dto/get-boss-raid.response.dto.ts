import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../config/base.response';
export abstract class GetBossRaidResultData {
  @ApiProperty({
    example: N,
    description: '입장 가능 여부',
    required: true,
  })
  canEnter: boolean;

  @ApiProperty({
    example: 1,
    description: '입장한 userId',
    required: true,
  })
  enteredUserId: number;
}

export abstract class GetBossRaidResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  result: GetBossRaidResultData;
}
