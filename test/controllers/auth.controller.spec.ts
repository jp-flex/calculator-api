import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';
import { CreateUserDto } from '../../src/dtos/create.user.dto';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let authService: AuthService;
  
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        controllers: [AuthController],
        providers: [
          {
            provide: AuthService,
            useValue: {
              signUp: jest.fn(),
              login: jest.fn(),
            },
          },
        ],
      }).compile();
  
      app = moduleFixture.createNestApplication();
      authService = moduleFixture.get<AuthService>(AuthService);
  
      await app.init();
    });
  
    afterAll(async () => {
      await app.close();
    });
  
    describe('POST /auth/signup', () => {
      it('should return 201 created when signup is successful', () => {
        const createUserDto: CreateUserDto = {
          username: 'testuser',
          password: 'testpassword',
        };
  
        (authService.signUp as jest.Mock).mockResolvedValueOnce(undefined);
  
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(createUserDto)
          .expect(HttpStatus.CREATED);
      });
  
      it('should return 409 conflict when signup fails due to existing username', () => {
        const createUserDto: CreateUserDto = {
          username: 'existinguser',
          password: 'testpassword',
        };
  
        (authService.signUp as jest.Mock).mockRejectedValueOnce(new Error('Username already exists'));
  
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(createUserDto)
          .expect(HttpStatus.CONFLICT);
      });
    });
  
    describe('POST /auth/login', () => {
      it('should return 200 ok and a token when login is successful', () => {
        const createUserDto: CreateUserDto = {
          username: 'testuser',
          password: 'testpassword',
        };
  
        (authService.login as jest.Mock).mockResolvedValueOnce({ token: 'testtoken' });
  
        return request(app.getHttpServer())
          .post('/auth/login')
          .send(createUserDto)
          .expect(HttpStatus.OK)
          .expect((res) => {
            // Ensure the response contains a token
            expect(res.body.token).toBeDefined();
          });
      });
  
      it('should return 400 bad request when login fails due to invalid credentials', () => {
        const createUserDto: CreateUserDto = {
          username: 'testuser',
          password: 'invalidpassword',
        };
  
        (authService.login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));
  
        return request(app.getHttpServer())
          .post('/auth/login')
          .send(createUserDto)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });