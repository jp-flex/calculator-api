export class UnavailableUsernameException extends Error {
  constructor(msg:string) {
    super(msg);
  }
}