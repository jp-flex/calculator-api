import { Injectable } from '@nestjs/common';
import { Operation } from '../entities/operation.entity';

@Injectable()
export class OperationRepository {
  private operations: Operation[] = [
    { id: 1, type: 'addition', cost: 1, records:[]},
    { id: 2, type: 'subtraction', cost: 2, records:[] },
    { id: 3, type: 'multiplication', cost: 3, records:[] },
    { id: 4, type: 'division', cost: 4, records:[] },
    { id: 5, type: 'square_root', cost: 5, records:[] },
    { id: 6, type: 'random_string', cost: 6, records:[] },
  ];

  findAll(): Operation[] {
    return this.operations;
  }

  findOne(id: number): Operation {
    return this.operations.find((operation) => operation.id === id);
  }
}
