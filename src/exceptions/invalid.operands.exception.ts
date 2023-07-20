export class InvalidOperandsException extends Error {
  constructor() {
    super('The number of operands is not correct for the operator');
  }
}