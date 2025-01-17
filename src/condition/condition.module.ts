import { Module } from '@nestjs/common';
import { ConditionService } from './condition.service';
import { ConditionController } from './condition.controller';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../common/prisma.module';
import { JwtStrategy } from '../common/jwt.strategy';

@Module({
  imports: [PassportModule, PrismaModule],
  providers: [ConditionService, JwtStrategy],
  controllers: [ConditionController],
})
export class ConditionModule {}
