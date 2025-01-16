import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import {
  LoginResponse,
  LoginUserRequest,
  RegisterUserRequest,
  UserRequest,
  UserResponse,
} from '../model/user.model';
import { WebResponse } from '../model/web.model';

type UserProfile = {
  id: string;
  email: string;
  name?: string;
};

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.register(request);
    return {
      data: result,
    };
  }

  @Post('login')
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<LoginResponse>> {
    const user = await this.authService.validateUser(request);
    const result = await this.authService.jwtSign(user);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: UserRequest): UserProfile {
    return req.user; // Mengembalikan data user dari JWT
  }
}
