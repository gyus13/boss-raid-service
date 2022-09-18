import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from '../../config/base.response';

// Admin 정보
class UserInfo {
  @ApiProperty({
    example: 1,
    description: '유저 아이디',
    required: true,
  })
  userId: number;
}

export abstract class PostUserResultData {
  @ApiProperty({
    description: 'user 객체',
    type: UserInfo,
    required: true,
    isArray: false,
  })
  adminInfo: UserInfo;
}

export abstract class PostUserResponse extends BaseResponse {
  @ApiProperty({
    description: 'result 객체',
    required: true,
  })
  result: PostUserResultData;
}
