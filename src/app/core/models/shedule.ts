export class WorkDayFB {
    constructor(
      public id: number,
      public status: 'R' | 'E' | 'NW', 
      public dayName: string,  
      public openingTime: string,       
      public closingTime: string,      
      public date?: string       
    ) {}
  }
  

export class WorkDayData {
    constructor(
        public id: string,
        public WorkDay: WorkDayFB 
    ){}
}