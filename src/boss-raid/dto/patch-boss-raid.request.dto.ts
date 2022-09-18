import { ApiProperty } from '@nestjs/swagger';

export class PatchBossRaidRequest {
  @ApiProperty({
    example: 1,
    description: 'userId',
    required: true,
  })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'raidRecordId',
    required: true,
  })
  raidRecordId: number;
}
