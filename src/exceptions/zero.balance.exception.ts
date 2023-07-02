export class ZeroBalanceException extends Error {
  constructor(msg:string) {
    super(msg);
  }
}
