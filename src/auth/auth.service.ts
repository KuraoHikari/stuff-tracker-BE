import {
  Inject,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
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

    const loginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    const user = await this.prismaService.user.findUnique({
      where: { email: loginUserRequest.email },
    });

    if (
      user &&
      (await bcrypt.compare(loginUserRequest.password, user.password))
    ) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async jwtSign(request: JwtSignRequest): Promise<LoginResponse> {
    this.logger.info(`Signing JWT for user: ${request.email}`);

    const jwtSignRequest = this.validationService.validate(
      UserValidation.JWT_SIGN,
      request,
    );

    const payload = { email: jwtSignRequest.email, sub: jwtSignRequest.id };

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

    const existingUser = await this.prismaService.user.findUnique({
      where: { email: registerUserRequest.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

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

    const updateProfileRequest = this.validationService.validate(
      UserValidation.UPDATE_PROFILE,
      request,
    );

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        name: updateProfileRequest.name,
      },
    });

    const { password, ...result } = updatedUser;

    return result;
  }
}
