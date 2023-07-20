import { NonArithmeticOperator } from "./non.arithmetic.operator";
import axios from "axios";
import { ThirdPartyException } from "../exceptions/third.party.exception";

export class RandomString implements NonArithmeticOperator {

  type: string;

  constructor(type:string) {
    this.type = type;
  }

  async performOperationAsync(): Promise<string> {
    try {
      const response =  await axios
        .get('https://www.random.org/strings/?num=1&len=10&digits=on&upperalpha=on&loweralpha=on&format=plain');
      return response.data.trim();
    } catch (error) {
      throw new ThirdPartyException('Operation unavailable at the moment.');
    }
  }

}