
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create.user.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.authService.signUp(createUserDto);
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto): Promise<{ token: string }> {

    let token = null;
    try {
      token =  await this.authService.login(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message)
    }

    return token;
  }
}

