
import { Controller, Post, Body, BadRequestException, 
  ConflictException, 
  Version,
  HttpCode} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create.user.dto';
import { AuthService } from '../services/auth.service'
import * as sanitizeHtml from 'sanitize-html';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<void> {
    this.sanitizeCredentials(createUserDto);
    try {
      await this.authService.signUp(createUserDto);
    } catch(error) {
      throw new ConflictException(error.message);
    }
  }

  @Version('1')
  @Post('login')
  @HttpCode(200)
  async login(@Body() createUserDto: CreateUserDto): Promise<{ token: string }> {
    let token = null;
    this.sanitizeCredentials(createUserDto);
    console.log("user: ", createUserDto.username, createUserDto.password)
    try {
      token =  await this.authService.login(createUserDto);
    } catch (error) {
      throw new BadRequestException(error.message)
    }

    return token;
  }

  sanitizeCredentials(createUserDto:CreateUserDto) {
    createUserDto.password = sanitizeHtml(createUserDto.password);
    createUserDto.username = sanitizeHtml(createUserDto.username);
    
    if (!createUserDto.username || !createUserDto.password)
      throw new BadRequestException("Invalid credentials!");
  }
}

