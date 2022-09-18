import {Controller, Get, Post} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';

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
  async postAdminSignIn() {
    // return await this.authService.createAdminSignIn(postAdminSignIn);
  }

  /**
   * description : 유저생성 API
   * @param non
   * @returns non
   */
  @ApiResponse({
    status: 200,
    description: '성공',
    // type: PostAdminSignUpResponse,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '유저생성 API' })
  @Post()
  async postAdminSignUp() {
    // return await this.userService.createAdminSignUp(postAdminSignUp);
  }
}
