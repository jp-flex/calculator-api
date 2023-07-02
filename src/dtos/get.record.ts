import { ApiProperty } from '@nestjs/swagger';
import { Operation } from '../entities/operation.entity';

export class GetRecord {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  operation: Operation;

  @ApiProperty()
  operationResponse: string;

  @ApiProperty()
  userBalance: number;
  
  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
