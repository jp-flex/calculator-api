import { InvalidOperandsException } from "../exceptions/invalid.operands.exception"
import { ArithmeticOperator } from "./arithmetic.operator";

export class Multiply implements ArithmeticOperator {

  type:string;

  constructor(type:string) {
    this.type = type;
  }

  performOperation(operands: number[]): number {
    if (!operands || (operands && operands.length < 2)) {
      throw new InvalidOperandsException();
    }

    return operands[0] * operands[1];
  }

}