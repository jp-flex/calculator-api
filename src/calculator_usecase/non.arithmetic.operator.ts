export interface NonArithmeticOperator {

  type:string;

  performOperationAsync():Promise<string>;

}

export enum NonArithmeticOperators {
  RandomString = "random-string"
}