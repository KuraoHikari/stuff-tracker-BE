// Import NestFactory to create a NestJS application instance
import { NestFactory } from '@nestjs/core';

// Import the AppModule which is the root module of the application
import { AppModule } from './app.module';

// Import the WINSTON_MODULE_NEST_PROVIDER for logging
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

// Define an asynchronous bootstrap function to initialize the application
async function bootstrap() {
  // Create a NestJS application instance using the AppModule
  const app = await NestFactory.create(AppModule);

  // Get the logger instance from the application
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  // Use the logger for the application
  app.useLogger(logger);

  // Enable CORS with multiple origins
  app.enableCors({
    origin: ['http://localhost:5173', 'http://example2.com'], // Allow these origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  });

  // Start the application and listen on port 3000
  await app.listen(3000);
}

// Call the bootstrap function to start the application
bootstrap();
