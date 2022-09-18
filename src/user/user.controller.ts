import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { PostUserResponse } from './dto/post-user.response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * description : 유저조회 API
   * @param
   * @returns
   */
  @ApiResponse({
    status: 200,
    description: '성공',
    // type: PostAdminSignInResponse,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '유저조회 API' })
  @Get('/:userId')
  async postAdminSignIn(@Param('userId') id: number) {
    // return await this.userService.retrieveUserByUserId(id);
  }

  /**
   * description : 유저생성 API
   * @param non
   * @returns non
   */
  @ApiResponse({
    status: 200,
    description: '성공',
    type: PostUserResponse,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '유저생성 API' })
  @Post()
  async postAdminSignUp() {
    // return await this.userService.createUser();
  }
}
