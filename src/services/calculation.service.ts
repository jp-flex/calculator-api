import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DivisionByZeroException } from 'src/exceptions/division.by.zero.exception';
import { InvalidOperatorException } from 'src/exceptions/invalid.operator.exception';
import { ThirdPartyException } from 'src/exceptions/third.party.exception';
import { Repository } from 'typeorm';
import { Operation } from '../entities/operation.entity';
import { RecordService } from './record.service';
import  axios  from 'axios';
import { ZeroBalanceException } from 'src/exceptions/zero.balance.exception';


@Injectable()
export class CalculationService {
  constructor(
    private readonly recordService: RecordService,
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>
  ) {}

  async performTwoOperandsCalc(firstOperand: number, secondOperand: number, userId: number, operator:string): Promise<number> {
    const operation = await this.operationRepository.findOne({ where: { type: operator } });
 
    if (!operation)
        throw new InvalidOperatorException()
    
    let result = 0;

    switch (operator) {
        case 'addition': {
            result = firstOperand + secondOperand;
            break;
        }
        case 'subtraction': {
            result = firstOperand - secondOperand;
            break;
        }
        case 'multiplication': {
            result =  firstOperand * secondOperand;
            break;
        }
        case 'division': {
            if (secondOperand === 0)
                throw new DivisionByZeroException();

            result = firstOperand / secondOperand;
            break;
        }
    }
    
    await this.verifyBalanceAndCreateRecord(userId, result.toString(), operation);
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

  async performSquareRoot(operand: number, userId: number): Promise<number> {
    const operation = await this.operationRepository.findOne({ where: { type: 'square-root' } });
    
    if (!operation)
       throw new InvalidOperatorException()

    let result = operand*operand;
    
    await this.verifyBalanceAndCreateRecord(userId, result.toString(), operation);
    return result;
  }

  async generateRandomString(userId: number): Promise<string> {
    const operation = await this.operationRepository.findOne({ where: { type: 'random-string' } });

    if (!operation)
        throw new Error("not found random-string operator");

    let response:any;
    try {
      response =  await axios
          .get('https://www.random.org/strings/?num=1&len=10&digits=on&upperalpha=on&loweralpha=on&format=plain');
    } catch (error) {
      throw new ThirdPartyException('Operation unavailable at the moment.');
    }

    const randomString = response.data.trim();
    await this.verifyBalanceAndCreateRecord(userId, randomString, operation);
    return randomString;
  }
}
