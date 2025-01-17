import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import {
  LoginResponse,
  LoginUserRequest,
  RegisterUserRequest,
  UserProfile,
  UserRequest,
  UserResponse,
} from '../model/user.model';
import { WebResponse } from '../model/web.model';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.register(request);
    return {
      data: result,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req: UserRequest): UserProfile {
    return {
      id: req.user.userId,
      email: req.user.email,
      name: req.user.name,
    }; // Mengembalikan data user dari JWT
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Request() req: UserRequest,
    @Body() request: Omit<UserProfile, 'id' | 'email'>, // Menghilangkan field id dari UserProfile,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.authService.updateProfile(
      req.user.userId,
      request,
    );
    return {
      data: result,
    };
  }
}
