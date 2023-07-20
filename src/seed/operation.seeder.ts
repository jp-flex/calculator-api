import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Operation } from '../entities/operation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { ArithmeticOperators } from '../calculator_usecase/arithmetic.operator';
import { NonArithmeticOperators } from '../calculator_usecase/non.arithmetic.operator';

@Injectable()
export class OperationSeeder implements OnModuleInit {

  constructor(
    @InjectRepository(Operation)
    private readonly operationRepo: Repository<Operation>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>) {}

  private operationsDao: Operation[] = [
    { id: 1, type: ArithmeticOperators.Addition, cost: 5, records:[] },
    { id: 2, type: ArithmeticOperators.Subtract, cost: 2, records:[]},
    { id: 3, type: ArithmeticOperators.Multiply, cost: 3, records:[] },
    { id: 4, type: ArithmeticOperators.Division, cost: 4, records:[] },
    { id: 5, type: ArithmeticOperators.SquareRoot, cost: 10, records:[] },
    { id: 6, type: NonArithmeticOperators.RandomString, cost: 12, records:[] },
  ];

  async onModuleInit() {
    await this.seedOperations();
  }

  async seedOperations() { 
    await this.operationRepo.save(this.operationsDao);

    const username = 'test@test.com';
    const existingTestUser = await this.userRepo.findOne({ where: { username } });

    if (!existingTestUser) {
      const hashedPassword = await bcryptjs.hash('@11aa', 10);
      await this.userRepo.save({username:'test@test.com',
       password:hashedPassword, status:'active'})
    }
  }
}
