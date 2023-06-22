import { Controller, Post, Req, Param, UseGuards, ParseIntPipe, BadRequestException, 
  NotFoundException, HttpException, HttpStatus} from '@nestjs/common';
import { DivisionByZeroException } from 'src/exceptions/division.by.zero.exception';
import { InvalidOperatorException } from 'src/exceptions/invalid.operator.exception';
import { ThirdPartyException } from 'src/exceptions/third.party.exception';
import { ZeroBalanceException } from 'src/exceptions/zero.balance.exception';
import { JwtMiddleware } from 'src/middlewares/jwt-middeware';
import { CalculationService } from 'src/services/calculation.service';

@Controller('calculator')
@UseGuards(JwtMiddleware)
export class CalculatorController {

  constructor(private readonly calculationService: CalculationService) {}

  @Post(':operator/:firstOperand/:secondOperand')
  async twoOperandsCalc(
    @Param('operator') operator: string,
    @Param('firstOperand', ParseIntPipe) firstOperand: number,
    @Param('secondOperand', ParseIntPipe) secondOperand: number,
    @Req() req
  ) {
    let result = 0
    try {
      result = await this.calculationService.performTwoOperandsCalc(firstOperand, secondOperand, req.user.id, operator);
      return { result };
    } catch (error) {
      if (error instanceof DivisionByZeroException) {
        throw new BadRequestException(error.message);
      } else if (error instanceof ZeroBalanceException) {
        throw new BadRequestException(error.message);
      } 
    } 
  }

  @Post('/square-root/:operand/')
  async squareRoot(
    @Param('operand', ParseIntPipe) operand: number,
    @Req() req
  ) {
    let result = 0
    try {
      result = await this.calculationService.performSquareRoot(operand, req.user.id);
      return { result };
    } catch (error) {

      throw new BadRequestException(error.message);  
    } 
    
  }

  @Post('random-string/')
  async randomString(
    @Req() req
  ) {
   
    let result = '';
    try {
      result = await this.calculationService.generateRandomString( req.user.id);
      return { result };
    } catch (error) {
      if (error instanceof ThirdPartyException) {
        throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
      } else {
        throw new BadRequestException(error.message);  
      } 
    } 
    
  }

 
}

