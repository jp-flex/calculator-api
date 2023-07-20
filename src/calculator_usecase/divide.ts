import { throws } from "assert";
import { DivisionByZeroException } from "../exceptions/division.by.zero.exception";
import { InvalidOperandsException } from "../exceptions/invalid.operands.exception";
import { ArithmeticOperator } from "./arithmetic.operator";

export class Divide implements ArithmeticOperator {

  type:string;

  constructor(type:string) {
    this.type = type;
  }

  performOperation(operands: number[]): number {

    if (!operands ||  (operands && operands.length < 2)) {
      throw new InvalidOperandsException();
    }

    if (operands[1] === 0) {
      throw new DivisionByZeroException();
    }

    return operands[0] / operands[1];
  }

}