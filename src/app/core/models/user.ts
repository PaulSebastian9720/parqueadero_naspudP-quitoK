import { Automobile } from "./automobile";

export class UserFB {
  
    constructor(
      public name: string,
      public state: boolean,
      public last_name: string,
      public correo: string,
      public rol: 'C' | 'A' |'CF',
      public birthDay?: Date | "",
      public direction?: string,
      public city?: string,
      public phone?: string,
      public correoS?: string,
      public listAutomobile?: Automobile [],
      public listManagement?: string[],
    ){}
}

export class UserData {
  constructor(
    public crendentialUserUID : string,
    public user : UserFB,
  ){}
} 