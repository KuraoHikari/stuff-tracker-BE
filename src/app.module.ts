import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma.module';
import { LocationModule } from './location/location.module';
import { CategoryModule } from './category/category.module';
import { ConditionModule } from './condition/condition.module';
import { StatusModule } from './status/status.module';
import { ActionModule } from './action/action.module';
import { ItemModule } from './item/item.module';

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
    ItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
