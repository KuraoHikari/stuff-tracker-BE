import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../common/prisma.module';
import { ActionController } from './action.controller';
import { JwtStrategy } from '../common/jwt.strategy';

@Module({
  imports: [PassportModule, PrismaModule],
  providers: [ActionService, JwtStrategy],
  controllers: [ActionController],
})
export class ActionModule {}
