import { RandomString } from "../../src/calculator_usecase/random.string";
import axios from 'axios';
import { ThirdPartyException } from "../../src/exceptions/third.party.exception";

describe( "Random string operator", () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return successful subtract", async () => {

    const mockResponse = { data: 'randomString' };
    const op:RandomString = new RandomString('random-string');

    jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);

    const result = await op.performOperationAsync();

    expect(result).toBe("randomString");

  });

  it("should throw exception when not enough operands", async () => {
    jest.spyOn(axios, 'get').mockRejectedValue(new Error('Request failed'));
    const op:RandomString = new RandomString('random-string');

    await expect(  op.performOperationAsync()).rejects.toThrow(ThirdPartyException);
  });

});