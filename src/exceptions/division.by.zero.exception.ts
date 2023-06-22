export class DivisionByZeroException extends Error {
  constructor() {
    super('Division by zero is not allowed');
  }
}