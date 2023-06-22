import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Operation } from 'src/entities/operation.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OperationSeeder implements OnModuleInit {

  constructor(
    @InjectRepository(Operation)
    private readonly operationRepo: Repository<Operation>) {}

  private operations: Operation[] = [
    { id: 1, type: 'addition', cost: 1, records:[] },
    { id: 2, type: 'subtraction', cost: 2, records:[]},
    { id: 3, type: 'multiplication', cost: 3, records:[] },
    { id: 4, type: 'division', cost: 4, records:[] },
    { id: 5, type: 'square-root', cost: 5, records:[] },
    { id: 6, type: 'random-string', cost: 6, records:[] },
  ];

  async onModuleInit() {
    await this.seedOperations();
  }

  async seedOperations() { 
    for (const operation of this.operations) {
      const existingOperation = await this.operationRepo.findOne({where :{ type: operation.type}});


      if (!existingOperation) {
        const ret = this.operationRepo.save(operation);
      }
    }
  }
}
