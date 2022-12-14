import { ApiProperty } from '@nestjs/swagger';

// 기본적인 response 구조
export abstract class BaseResponse {
  @ApiProperty({
    example: true,
    description: 'API 성공 여부',
    required: true,
  })
  isSuccess: boolean;

  @ApiProperty({
    example: 200,
    description: '코드 번호',
    required: true,
  })
  code: number;

  @ApiProperty({
    example: '성공',
    description: 'API 성공 메시지',
    required: true,
  })
  message: string;
}
