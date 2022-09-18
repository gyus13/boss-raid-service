import { ApiProperty } from '@nestjs/swagger';

export class PostBossRaidRequest {
  @ApiProperty({
    example: 1,
    description: 'userId',
    required: true,
  })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'level',
    required: true,
  })
  level: number;
}
