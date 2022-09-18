import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../config/base.response';

export abstract class PostUserResultData {
  @ApiProperty({
    example: 1,
    description: '유저 아이디',
    required: true,
  })
  userId: number;
}

export abstract class PostUserResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  result: PostUserResultData;
}
