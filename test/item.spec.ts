import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Item Controller', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeAll(async () => {
    // Create a testing module with AppModule and TestModule
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    // Create and initialize the Nest application
    app = moduleFixture.createNestApplication();
    await app.init();

    // Get the logger and test service instances
    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('test /api/items', () => {
    // Variable to store login response
    let loginResponse: any;

    beforeEach(async () => {
      // Clean the database before each test
      await testService.cleanDb();

      // Delete and create a test user
      await testService.deleteUser();
      await testService.createUser();

      // Log in with the test user and store the response
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@mail.com',
          password: 'test password',
        });

      loginResponse = response;
    });

    // Test case: Reject if user is not authenticated
    it('should be rejected if user is not authenticated', async () => {
      const response = await request(app.getHttpServer()).get('/api/items');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
    });

    // Test case: Reject if request is invalid
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/items')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`)
        .send({
          name: '',
          description: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    // Test case: Create an item
    it('should be able to create an item', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/items')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`)
        .send({
          name: 'test name',
          description: 'test description',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('test name');
      expect(response.body.data.description).toBe('test description');
    });

    // Test case: Get all items
    it('should be able to get all items', async () => {
      await request(app.getHttpServer())
        .post('/api/items')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`)
        .send({
          name: 'test name',
          description: 'test description',
        });

      const response = await request(app.getHttpServer())
        .get('/api/items')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.items.length).toBe(1);
    });

    // Test case: Get a single item
    it('should be able to get an item', async () => {
      // Create an item and get its ID
      const createResponse = await request(app.getHttpServer())
        .post('/api/items')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`)
        .send({
          name: 'test name',
          description: 'test description',
        });

      // Get the item by ID
      const response = await request(app.getHttpServer())
        .get(`/api/items/${createResponse.body.data.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test name');
      expect(response.body.data.description).toBe('test description');
    });

    // Test case: Reject if item is not found
    it('should be rejected if item is not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/items/123')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    // Test case: Update an item
    it('should be able to update an item', async () => {
      // Create an item and get its ID
      const createResponse = await request(app.getHttpServer())
        .post('/api/items')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`)
        .send({
          name: 'test name',
          description: 'test description',
        });

      // Update the item by ID
      const response = await request(app.getHttpServer())
        .put(`/api/items/${createResponse.body.data.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`)
        .send({
          name: 'test name updated',
          description: 'test description updated',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test name updated');
      expect(response.body.data.description).toBe('test description updated');
    });

    // Test case: Reject if item is not found for update
    it('should be rejected if item is not found', async () => {
      const response = await request(app.getHttpServer())
        .put('/api/items/123')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`)
        .send({
          name: 'test name updated',
          description: 'test description updated',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    // Test case: Delete an item
    it('should be able to delete an item', async () => {
      // Create an item and get its ID
      const createResponse = await request(app.getHttpServer())
        .post('/api/items')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`)
        .send({
          name: 'test name',
          description: 'test description',
        });

      // Delete the item by ID
      const response = await request(app.getHttpServer())
        .delete(`/api/items/${createResponse.body.data.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`);

      logger.info(response.body);

      expect(response.status).toBe(204);
    });
  });
});
