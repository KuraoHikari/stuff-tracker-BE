import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Auth Controller', () => {
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

  describe('test /api/auth', () => {
    beforeEach(async () => {
      await testService.deleteAllCategories();
      await testService.deleteUser();
    });

    it('shoud be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: '',
          name: '',
          password: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('shoud be able to register', async () => {
      await testService.deleteUser();
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@mail.com',
          name: 'test name',
          password: 'test password',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe('test@mail.com');
      expect(response.body.data.name).toBe('test name');
    });

    it('shoud be rejected if email is already taken', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@mail.com',
          name: 'test name',
          password: 'test password',
        });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('User already exists');
    });

    it('shoud be able to login', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@mail.com',
          password: 'test password',
        });

      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.data.access_token).toBeDefined();
    });

    it('shoud be rejected if email is not found', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'testnotfound@mail.com',
          password: 'test password',
        });

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Invalid credentials');
    });

    it('shoud be rejected if password is incorrect', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@mail.com',
          password: 'test passw',
        });

      logger.info(response.body);
      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.message).toBe('Invalid credentials');
    });

    it('shoud be able to get user profile', async () => {
      await testService.createUser();
      const loginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@mail.com',
          password: 'test password',
        });

      const response = await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${loginResponse.body.data.access_token}`);
      logger.info(response.body);
      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.email).toBe('test@mail.com');
    });
  });
});
