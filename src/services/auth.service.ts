import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dtos/create.user.dto';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    await this.userService.createUser(createUserDto);
  }

  async login(createUserDto: CreateUserDto): Promise<{ token: string }> {
    const user = await this.userService.validateUser(createUserDto.username, createUserDto.password);

    if (!user)
      throw new Error('user credentials are invalid!')

    const payload = { id: user.id, username: user.username };
    const secretKey = 'secret-key';
    const options = { secret: secretKey, expiresIn: '1h' };

    const token = this.jwtService.sign(payload, options);
    return { token };
  }
}