import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Category Controller', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('test /api/categories', () => {
    //login before all tests
    let loginResponse: any;

    beforeEach(async () => {
      await testService.deleteAllCategories();
      await testService.deleteUser();
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@mail.com',
          password: 'test password',
        });

      loginResponse = response;
    });

    //reject if user is not authenticated
    it('shoud be rejected if user is not authenticated', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/categories',
      );

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
    });

    it('shoud be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`)
        .send({
          name: '',
          description: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('shoud be able to create a category', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/categories')
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

    it('shoud be able to get all categories', async () => {
      await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`)
        .send({
          name: 'test name',
          description: 'test description',
        });

      const response = await request(app.getHttpServer())
        .get('/api/categories')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.categories.length).toBe(1);
    });

    it('shoud be able to get a category', async () => {
      //get the category id
      const createResponse = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`)
        .send({
          name: 'test name',
          description: 'test description',
        });

      const response = await request(app.getHttpServer())
        .get(`/api/categories/${createResponse.body.data.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test name');
      expect(response.body.data.description).toBe('test description');
    });

    it('shoud be rejected if category is not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/categories/123')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    it('shoud be able to update a category', async () => {
      //get the category id
      const createResponse = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`)
        .send({
          name: 'test name',
          description: 'test description',
        });

      const response = await request(app.getHttpServer())
        .put(`/api/categories/${createResponse.body.data.id}`)
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

    it('shoud be rejected if category is not found', async () => {
      const response = await request(app.getHttpServer())
        .put('/api/categories/123')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`)
        .send({
          name: 'test name updated',
          description: 'test description updated',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    it('shoud be able to delete a category', async () => {
      //get the category id
      const createResponse = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`)
        .send({
          name: 'test name',
          description: 'test description',
        });

      const response = await request(app.getHttpServer())
        .delete(`/api/categories/${createResponse.body.data.id}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`);

      logger.info(response.body);

      expect(response.status).toBe(204);
    });
  });
});
