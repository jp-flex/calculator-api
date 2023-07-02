import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../src/dtos/create.user.dto';
import { AuthService } from '../../src/services/auth.service';
import { UserService } from '../../src/services/user.service';

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UserService;
    let jwtService: JwtService;
  
    beforeEach(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: UserService,
            useValue: {
              createUser: jest.fn(),
              validateUser: jest.fn(),
            },
          },
          {
            provide: JwtService,
            useValue: {
              sign: jest.fn(),
            },
          },
        ],
      }).compile();
  
      authService = moduleRef.get<AuthService>(AuthService);
      userService = moduleRef.get<UserService>(UserService);
      jwtService = moduleRef.get<JwtService>(JwtService);
    });
  
    describe('signUp', () => {
      it('should call createUser method of UserService with the correct arguments', async () => {
        const createUserDto: CreateUserDto = { username: 'testuser', password: 'password' };
  
        await authService.signUp(createUserDto);
  
        expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
      });
    });
  
    describe('login', () => {
      it('should return a token when user credentials are valid', async () => {
        const createUserDto: CreateUserDto = { username: 'testuser', password: 'password' };
        const mockUser = { id: 1, username: 'testuser' };
        const mockToken = 'mockToken';
  

        jest.spyOn(userService, "validateUser").mockImplementation((username, password) => {
            if (username === createUserDto.username && password === createUserDto.password) {
                return Promise.resolve(mockUser);
              }
              return Promise.resolve(null);
        })
               
        jest.spyOn(jwtService, "sign").mockImplementation((username, password) => mockToken);
  
        const result = await authService.login(createUserDto);
  
        expect(userService.validateUser)
            .toHaveBeenCalledWith(createUserDto.username, createUserDto.password);
        expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser.id, username: mockUser.username }, 
            { secret: 'secret-key', expiresIn: '1h' });
        expect(result).toEqual({ token: mockToken });
      });
  
      it('should throw an error when user credentials are invalid', async () => {
        const createUserDto: CreateUserDto = { username: 'testuser', password: 'password' };
  
        jest.spyOn(userService, "validateUser").mockImplementation((username, password) =>  null);
  
        await expect(authService.login(createUserDto)).rejects.toThrow('user credentials are invalid!');
      });
    });
  });
