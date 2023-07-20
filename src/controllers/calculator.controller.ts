import { Controller, Post, Get, Req, Param, BadRequestException, 
  HttpException, HttpStatus, Version, Body} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OperandsDto } from '../dtos/operands.dto';
import { DivisionByZeroException } from '../exceptions/division.by.zero.exception';
import { InvalidOperandsException } from '../exceptions/invalid.operands.exception';
import { InvalidOperatorException } from '../exceptions/invalid.operator.exception';
import { ZeroBalanceException } from '../exceptions/zero.balance.exception';
import { CalculationService } from '../services/calculation.service';

@ApiBearerAuth()
@Controller('calculator')
export class CalculatorController {

  constructor(private readonly calculationService: CalculationService) {}

  @Version('1')
  @Post('arithmetic-operation/:operator')
  async arithmeticOperation(
    @Req() req,
    @Param('operator') operator: string,
    @Body() body:OperandsDto
  ) {
    let result = 0;
    try {
      result = await this.calculationService
        .performArithmeticCalc(req.user.id, operator, body.operands);
      return { result };
    } catch (error) {
      if (error instanceof DivisionByZeroException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof ZeroBalanceException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof InvalidOperatorException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof InvalidOperandsException) {
        throw new BadRequestException(error.message);
      }
    } 
  }

  @Version('1')
  @Post('non-arithmetic-operation/:operator')
  async noOperandCalc(
    @Req() req,
    @Param('operator') operator: string,
  ) {
   
    let result = '';
    try {
      result = await this.calculationService.performNonArithmeticCalc( req.user.id, operator);
      return { result };
    } catch (error) {
      if (error instanceof InvalidOperatorException){
        throw new BadRequestException(error.message);  
      } else if (error instanceof ZeroBalanceException) {
        throw new BadRequestException(error.message);  
      } else {
        throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
      }
    } 
    
  }

  @Version('1')
  @Get('operations/')
  async getOperations() {
    const operations = await this.calculationService.getOperations();
    const mapped = operations.map(op => {return {id: op.id, operation:op.type}});

    return {operations:  mapped};
  }
}