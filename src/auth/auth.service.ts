import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  JwtSignRequest,
  LoginResponse,
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
  ValidateUserResponse,
} from '../model/user.model';
import { UserValidation } from './auth.validation';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async validateUser(request: LoginUserRequest): Promise<ValidateUserResponse> {
    this.logger.info(`Validating user: ${request.email}`);

    const user = await this.prismaService.user.findUnique({
      where: { email: request.email },
    });
    if (user && (await bcrypt.compare(request.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async jwtSign(request: JwtSignRequest): Promise<LoginResponse> {
    this.logger.info(`Signing JWT for user: ${request.email}`);
    const payload = { email: request.email, sub: request.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Registering new user ${JSON.stringify(request)}`);

    const registerUserRequest = this.validationService.validate(
      UserValidation.REGISTER,
      request,
    );

    registerUserRequest.password = await bcrypt.hash(
      registerUserRequest.password,
      10,
    );

    const user = await this.prismaService.user.create({
      data: {
        email: registerUserRequest.email,
        name: registerUserRequest.name,
        password: registerUserRequest.password,
      },
    });

    return {
      email: user.email,
      name: user.name,
    };
  }

  async updateProfile(
    id: string,
    request: Omit<UserResponse, 'email'>,
  ): Promise<UserResponse> {
    this.logger.info(`Updating user profile: ${id}`);

    const user = await this.prismaService.user.update({
      where: { id },
      data: request,
    });

    const { password, ...result } = user;

    return result;
  }
}
