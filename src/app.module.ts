// Import the Module decorator from NestJS
import { Module } from '@nestjs/common';

// Import the CommonModule for shared services and utilities
import { CommonModule } from './common/common.module';

// Import the UserModule for user-related functionality
import { UserModule } from './user/user.module';

// Import the AuthModule for authentication-related functionality
import { AuthModule } from './auth/auth.module';

// Import the PrismaModule for database access
import { PrismaModule } from './common/prisma.module';

// Import the LocationModule for location-related functionality
import { LocationModule } from './location/location.module';

// Import the CategoryModule for category-related functionality
import { CategoryModule } from './category/category.module';

// Import the ConditionModule for condition-related functionality
import { ConditionModule } from './condition/condition.module';

// Import the StatusModule for status-related functionality
import { StatusModule } from './status/status.module';

// Import the ActionModule for action-related functionality
import { ActionModule } from './action/action.module';

// Import the ItemModule for item-related functionality
import { ItemModule } from './item/item.module';

// Define the AppModule
@Module({
  // Import all the necessary modules
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
  // No controllers are defined in the AppModule
  controllers: [],
  // No providers are defined in the AppModule
  providers: [],
})
// Export the AppModule
export class AppModule {}
