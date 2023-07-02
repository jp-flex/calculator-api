import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Operation } from '../entities/operation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class OperationSeeder implements OnModuleInit {

  constructor(
    @InjectRepository(Operation)
    private readonly operationRepo: Repository<Operation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>) {}

  private operations: Operation[] = [
    { id: 1, type: 'addition', cost: 50, records:[] },
    { id: 2, type: 'subtraction', cost: 2, records:[]},
    { id: 3, type: 'multiplication', cost: 3, records:[] },
    { id: 4, type: 'division', cost: 4, records:[] },
    { id: 5, type: 'square-root', cost: 25, records:[] },
    { id: 6, type: 'random-string', cost: 6, records:[] },
  ];

  async onModuleInit() {
    await this.seedOperations();
  }

  async seedOperations() { 
    await this.operationRepo.save(this.operations);

    const username = 'test@test.com';
    const existingTestUser = await this.userRepo.findOne({ where: { username } });

    if (!existingTestUser) {
      const hashedPassword = await bcryptjs.hash('@11aa', 10);
      await this.userRepo.save({username:'test@test.com',
       password:hashedPassword, status:'active'})
    }
  }
}
