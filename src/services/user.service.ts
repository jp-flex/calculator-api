import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from 'src/dtos/create.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { username, password } = createUserDto;
    const hashedPassword = await bcryptjs.hash(password, 10);
    await this.userRepository.save({ username, password: hashedPassword, status: 'active' });
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && await bcryptjs.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async get(id:number) : Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(user:User) {
    await this.userRepository.update(user.id, user);
  }
}