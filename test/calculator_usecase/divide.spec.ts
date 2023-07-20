import { Divide } from "../../src/calculator_usecase/divide";
import { InvalidOperandsException } from "../../src/exceptions/invalid.operands.exception";

describe( "Subtract operator", () => {

  it("should return successful division", () => {

    const op:Divide = new Divide('division');

    const operands = [10,5];

    expect(op.performOperation(operands)).toBe(2);

  });

  it("should throw exception when not enough operands", () => {

    const op:Divide = new Divide('division');

    const operands = [2];

    expect( () =>op.performOperation(operands))
      .toThrow(InvalidOperandsException);

  });

});