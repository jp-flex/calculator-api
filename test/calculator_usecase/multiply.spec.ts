import { Multiply } from "../../src/calculator_usecase/multiply";
import { InvalidOperandsException } from "../../src/exceptions/invalid.operands.exception";

describe( "Multiply operator", () => {

  it("should return successful multiply", () => {

    const op:Multiply = new Multiply('multiply');

    const operands = [5,5];

    expect(op.performOperation(operands)).toBe(25);

  });

  it("should throw exception when not enough operands", () => {

    const op:Multiply = new Multiply('multiply');

    const operands = [2];

    expect( () =>op.performOperation(operands))
      .toThrow(InvalidOperandsException);

  });

})