import { HttpException, HttpStatus } from '@nestjs/common';

export class ThirdPartyException extends Error {
  constructor(msg:string) {
    super(msg);
  }
}