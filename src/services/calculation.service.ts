import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvalidOperatorException } from '../exceptions/invalid.operator.exception';
import { Repository } from 'typeorm';
import { Operation } from '../entities/operation.entity';
import { RecordService } from './record.service';
import { ZeroBalanceException } from '../exceptions/zero.balance.exception';
import { ArithmeticOperator, ArithmeticOperators } from '../calculator_usecase/arithmetic.operator';
import { Add } from '../calculator_usecase/add';
import { Subtract } from '../calculator_usecase/subtract';
import { Divide } from '../calculator_usecase/divide';
import { Multiply } from '../calculator_usecase/multiply';
import { SquareRoot } from '../calculator_usecase/square.root';
import { NonArithmeticOperator, NonArithmeticOperators } from '../calculator_usecase/non.arithmetic.operator';
import { RandomString } from '../calculator_usecase/random.string';

@Injectable()
export class CalculationService {

  private arithmeticOperatorUseCases: ArithmeticOperator[] = [
    new Add(ArithmeticOperators.Addition),
    new Subtract(ArithmeticOperators.Subtract),
    new Divide(ArithmeticOperators.Division),
    new Multiply(ArithmeticOperators.Multiply),
    new SquareRoot(ArithmeticOperators.SquareRoot)
  ];

  private nonArithmeticOperatorsUseCases:NonArithmeticOperator[] = [
    new RandomString(NonArithmeticOperators.RandomString)
  ]

  constructor(
    private recordService: RecordService,
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>
  ) {}

  async performArithmeticCalc(userId:number, operator:string, 
    operands:number[]): Promise<number> {

    const operation = await this.operationRepository.findOne({ where: { type: operator } });

    if (!operation)
      throw new InvalidOperatorException(`Invalid operator: please use one
      of the following operators: ${Object.values(ArithmeticOperators).join(", ")}`);

    const arithmeticOperator = this.arithmeticOperatorUseCases
      .find(op =>op.type == operation.type);
    
    let result = arithmeticOperator.performOperation(operands);

    result = Number(result.toFixed(2));
    
    await this.verifyBalanceAndCreateRecord(userId, result.toString(), operation);
    return result;
  }

  async performNonArithmeticCalc(userId: number, operator:string): Promise<string> {
    const operation = await this.operationRepository.findOne({ where: { type: operator } });

    if (!operation)
      throw new InvalidOperatorException(`Invalid operator: please use one
      of the following operators: ${Object.values(NonArithmeticOperators).join(", ")}`);

    const op = this.nonArithmeticOperatorsUseCases.find( o => o.type = operation.type);

    const result = await op.performOperationAsync(); 

    await this.verifyBalanceAndCreateRecord(userId, result, operation);
    return result;
  }

  private async verifyBalanceAndCreateRecord(userId:number, result:string, operation:Operation) {

    const totalAmount = await this.recordService.getTotalAmount(userId);

    if (totalAmount + operation.cost > RecordService.USER_INITIAL_BALANCE) {
      throw new ZeroBalanceException(`There is not enough balance to proceed with this operation`); 
    }

    const newUserBalance = RecordService.USER_INITIAL_BALANCE - totalAmount - operation.cost;

    await this.recordService.createRecord(userId, newUserBalance,  operation, result);
  }

  async getOperations():Promise<Operation[]> {
    return await this.operationRepository.find();
  }
}
