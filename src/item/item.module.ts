// Import the Module decorator from NestJS
import { Module } from '@nestjs/common';

// Import the PassportModule for authentication
import { PassportModule } from '@nestjs/passport';

// Import the PrismaModule for database access
import { PrismaModule } from '../common/prisma.module';

// Import the ItemController
import { ItemController } from './item.controller';

// Import the JwtStrategy for JWT authentication
import { JwtStrategy } from '../common/jwt.strategy';

// Import the ItemService
import { ItemService } from './item.service';

// Define the ItemModule
@Module({
  // Import the PassportModule and PrismaModule
  imports: [PassportModule, PrismaModule],
  // Provide the ItemService and JwtStrategy
  providers: [ItemService, JwtStrategy],
  // Register the ItemController
  controllers: [ItemController],
})
// Export the ItemModule
export class ItemModule {}
