import { Add } from "../../src/calculator_usecase/add";
import { InvalidOperandsException } from "../../src/exceptions/invalid.operands.exception";

describe( "Add operator", () => {

  it("should return successful sum", () => {

    const op:Add = new Add('addition');

    const operands = [2,2];

    expect(op.performOperation(operands)).toBe(4);

  });

  it("should throw exception when not enough operands", () => {

    const op:Add = new Add('addition');

    const operands = [2];

    expect( () =>op.performOperation(operands)).toThrow(InvalidOperandsException);

  });

})