import { SquareRoot } from "../../src/calculator_usecase/square.root";
import { InvalidOperandsException } from "../../src/exceptions/invalid.operands.exception";

describe( "Square root operator", () => {

  it("should return successful square root", () => {

    const op:SquareRoot = new SquareRoot('square-root');

    const operands = [25];

    expect(op.performOperation(operands)).toBe(5);

  });

  it("should throw exception when not enough operands", () => {

    const op:SquareRoot = new SquareRoot('square-root');

    const operands = [];

    expect( () =>op.performOperation(operands))
      .toThrow(InvalidOperandsException);

  });

});