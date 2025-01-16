import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { PrismaModule } from 'src/common/prisma.module';
import { JwtStrategy } from 'src/common/jwt.strategy';
// Untuk mengakses database

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your_jwt_secret', // Ganti dengan secret yang aman
      signOptions: { expiresIn: '1d' }, // Token berlaku selama 1 hari
    }),
    PrismaModule, // Import PrismaModule untuk mengakses database
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
