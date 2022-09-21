import { ApiProperty } from '@nestjs/swagger';

export class PostBossRaidRankRequestDto {
    @ApiProperty({
        example: 1,
        description: 'userId',
        required: true,
    })
    userId: number;
}
