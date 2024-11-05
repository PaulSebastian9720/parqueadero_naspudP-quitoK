export class UserFB {
  
    constructor(
      public name: string,
      public state: boolean,
      public last_name: string,
      public correo: string,
      public rol: 'C' | 'A',
      public birthDay?: Date | null,
      public direction?: string,
      public city?: string,
      public phone?: string,
      public correoS?: string,
    ){}
    
    static fromJsson(jsson :any): UserFB {
      return new UserFB(
        jsson.name,
        jsson.state,
        jsson.last_name,
        jsson.correo,
        jsson.rol,
        jsson.birthDay? new Date(jsson.birthDay) : null,
        jsson.direction || '',
        jsson.city || '',
        jsson.phone || '',
        jsson.correoS || '',

      ) 
    }
}

export class UserData {
  constructor(
    public crendentialUserUID : string,
    public user : UserFB,
  ){}
} 