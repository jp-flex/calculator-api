import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { InvalidOperatorException } from '../exceptions/invalid.operator.exception';
import { ThirdPartyException } from '../exceptions/third.party.exception';
import { Repository } from 'typeorm';
import { Operation } from '../entities/operation.entity';
import { RecordService } from './record.service';
import { ZeroBalanceException } from '../exceptions/zero.balance.exception';
import { DivisionByZeroException } from '../exceptions/division.by.zero.exception';
import { InvalidOperandsException } from '../exceptions/invalid.operatands.exception';


@Injectable()
export class CalculationService {
  constructor(
    private recordService: RecordService,
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>
  ) {}

  async performArithmeticCalc(userId:number, operator:string, operands:number[]): Promise<number> {

    const operation = await this.operationRepository.findOne({ where: { type: operator } });
 
    if (!operation)
      throw new InvalidOperatorException();
    
    if (['addition', 'subtraction', 'division',
     'multiplication'].indexOf( operator) !== -1 && operands.length !== 2) {
      throw new InvalidOperandsException();
    } else if (operator === 'square-root'  && operands.length !== 1) {
      throw new InvalidOperandsException();
    } 
    
    let result = 0;
    switch (operator) {
      case 'addition': {
        result = operands[0] + operands[1];
        break;
      }
      case 'new-addition': {
        result = operands[0] + operands[1];
        break;
      }
      case 'subtraction': {
        result = operands[0] - operands[1];
        break;
      }
      case 'multiplication': {
        result =  operands[0] * operands[1];
        break;
      }
      case 'square-root': {
        result =  Math.sqrt(operands[0]);
        break;
      }
      case 'division': {
        if (operands[1] === 0)
          throw new DivisionByZeroException();

        result = operands[0] / operands[1];
        break;
      }
      default:
        throw new InvalidOperatorException();
    }

    result = Number(result.toFixed(2));
    
    await this.verifyBalanceAndCreateRecord(userId, result.toString(), operation);
    return result;

  }

  async performNonArithmeticCalc(userId: number, operator:string): Promise<string> {
    const operation = await this.operationRepository.findOne({ where: { type: operator } });

    let response:any;
    let result = "";

    switch (operator) {
      case 'random-string':
        try {
          response =  await axios
            .get('https://www.random.org/strings/?num=1&len=10&digits=on&upperalpha=on&loweralpha=on&format=plain');
          result = response.data.trim();
        } catch (error) {
          throw new ThirdPartyException('Operation unavailable at the moment.');
        }
        break;
      default:
        throw new InvalidOperatorException();
    }

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
