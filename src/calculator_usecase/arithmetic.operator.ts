export interface ArithmeticOperator {

  type:string;
  
  performOperation(operands:number[]):number;

}

export enum ArithmeticOperators {
  Addition = 'addition',
  Subtract = 'subtraction',
  Multiply = 'multiplication',
  SquareRoot = 'square-root',
  Division = 'division',
}