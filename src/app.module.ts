import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma.module';
import { LocationModule } from './location/location.module';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { ConditionController } from './condition/condition.controller';
import { ConditionModule } from './condition/condition.module';
import { StatusService } from './status/status.service';
import { StatusModule } from './status/status.module';
import { ActionController } from './action/action.controller';
import { ActionModule } from './action/action.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    AuthModule,
    PrismaModule,
    LocationModule,
    CategoryModule,
    ConditionModule,
    StatusModule,
    ActionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
