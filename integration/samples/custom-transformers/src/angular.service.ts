import { ValidateClass, AssertType } from 'typescript-is';

interface IMessage {
  code: number;
  content: string;
}

@ValidateClass()
export class AngularService {
  public sendMessage(@AssertType() message: IMessage) {
    return message;
  }
}
