import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../common/jwt.strategy';
import { PrismaModule } from '../common/prisma.module';

@Module({
  imports: [PassportModule, PrismaModule],
  providers: [LocationService, JwtStrategy],
  controllers: [LocationController],
})
export class LocationModule {}
