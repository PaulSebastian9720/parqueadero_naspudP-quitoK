export class WorkDayFB{
    constructor(
        public dayOfWeek: string,
        public open: string,
        public close: string
    ){}
}

export class WorkDayData {
    constructor(
        public id: string,
        public WorkDay: WorkDayFB 
    ){}
}