export class RateFB {
    constructor(
        public name: string,
        public timeUnit : string,
        public unitRate : number,
        public quantity : number,
        public comment  : string = "",
    ){}
}

export class RateData {
    constructor(
        public id: string,
        public rateFB: RateFB
    ){}
}