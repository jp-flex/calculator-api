import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidOperatorException extends Error {
  constructor() {
    super('Operator Not Found. '+ 
    'Please use one of these: addition | subtraction | division | multiply | square ');
  }
}