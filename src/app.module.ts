import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma.module';

@Module({
  imports: [CommonModule, UserModule, AuthModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
