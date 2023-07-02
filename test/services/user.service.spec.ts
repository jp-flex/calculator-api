import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from '../../src/dtos/create.user.dto';
import { UnavailableUsernameException } from '../../src/exceptions/unavailable.username.exception';
import { User } from '../../src/entities/user.entity';
import { UserService } from '../../src/services/user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword'
      };

      const hashedPassword = await bcryptjs.hash(createUserDto.password, 10);

      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);
      jest.spyOn(userRepository, "save").mockResolvedValueOnce(null);

      await userService.createUser(createUserDto);

      expect(userRepository.findOne).toBeCalledWith({ where: { username: createUserDto.username } });
      expect(userRepository.save).toBeCalledWith(
        expect.objectContaining({
            username: createUserDto.username,
            password: expect.stringMatching(/^.+$/), // Ensure password is a non-empty string
            status: 'active',
          })
      );
    });

    it('should throw UnavailableUsernameException when the username already exists', async () => {
      const existingUser: User = { id: 1, username: 'existinguser', password: 'existingpassword', status: 'active' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);

      const createUserDto: CreateUserDto = {
        username: 'existinguser',
        password: 'newpassword',
      };

      await expect(userService.createUser(createUserDto)).rejects.toThrow(UnavailableUsernameException);
    });
  });

  describe('validateUser', () => {
    it('should return the user when the username and password match', async () => {
      const password = 'testpassword';
      const hashedPassword = await bcryptjs.hash(password, 10);

      const user: User = { id: 1, username: 'testuser', password: hashedPassword, status: 'active' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const validatedUser = await userService.validateUser('testuser', 'testpassword');

      expect(validatedUser).toEqual(user);
    });

    it('should return null when the username or password do not match', async () => {
      const password = 'testpassword';
      const hashedPassword = await bcryptjs.hash(password, 10);

      const user: User = { id: 1, username: 'testuser', password: hashedPassword, status: 'active' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const validatedUser = await userService.validateUser('testuser', 'wrongpassword');

      expect(validatedUser).toBeNull();
    });

    it('should return null when the user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const validatedUser = await userService.validateUser('nonexistentuser', 'testpassword');

      expect(validatedUser).toBeNull();
    });
  });

});
