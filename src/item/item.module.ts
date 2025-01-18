import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../common/prisma.module';
import { ItemController } from './item.controller';
import { JwtStrategy } from '../common/jwt.strategy';
import { ItemService } from './item.service';

@Module({
  imports: [PassportModule, PrismaModule],
  providers: [ItemService, JwtStrategy],
  controllers: [ItemController],
})
export class ItemModule {}
