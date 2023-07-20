import { Subtract } from "../../src/calculator_usecase/subtract";
import { InvalidOperandsException } from "../../src/exceptions/invalid.operands.exception";

describe( "Subtract operator", () => {

  it("should return successful subtract", () => {

    const op:Subtract = new Subtract('subtraction');

    const operands = [5,5];

    expect(op.performOperation(operands)).toBe(0);

  });

  it("should throw exception when not enough operands", () => {

    const op:Subtract = new Subtract('subtraction');

    const operands = [2];

    expect( () =>op.performOperation(operands))
      .toThrow(InvalidOperandsException);

  });

});