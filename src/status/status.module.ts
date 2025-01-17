import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../common/prisma.module';
import { StatusService } from './status.service';
import { JwtStrategy } from '../common/jwt.strategy';

@Module({
  imports: [PassportModule, PrismaModule],
  providers: [StatusService, JwtStrategy],
  controllers: [StatusController],
})
export class StatusModule {}
