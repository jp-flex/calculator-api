import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayMaxSize, IsArray, IsNumber} from 'class-validator';

export class OperandsDto {
  @ApiProperty({ type: [Number], description: 'An array of numbers representing each operand' })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  operands: number[];
}
