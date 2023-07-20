import { InvalidOperandsException } from "../exceptions/invalid.operands.exception";
import { ArithmeticOperator } from "./arithmetic.operator";

export class SquareRoot implements ArithmeticOperator {

  type:string;

  constructor(type:string) {
    this.type = type;
  }

  performOperation(operands: number[]): number {

    if (!operands ||  (operands && operands.length === 0)) {
      throw new InvalidOperandsException();
    }

    return Math.sqrt(operands[0]);
  }

}