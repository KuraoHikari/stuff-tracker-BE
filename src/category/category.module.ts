import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../common/prisma.module';
import { JwtStrategy } from '../common/jwt.strategy';

@Module({
  imports: [PassportModule, PrismaModule],
  providers: [CategoryService, JwtStrategy],
  controllers: [CategoryController],
})
export class CategoryModule {}
