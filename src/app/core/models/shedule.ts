export class WorkDayFB {
    constructor(
      public id: number,
      public state: 'R' | 'E' | 'NO', 
      public dayOfWeek: string,  
      public open: string,       
      public close: string,      
      public date?: string       
    ) {}
  }
  

export class WorkDayData {
    constructor(
        public id: string,
        public WorkDay: WorkDayFB 
    ){}
}