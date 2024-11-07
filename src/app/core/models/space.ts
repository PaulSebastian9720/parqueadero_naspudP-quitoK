export class Space  {
    constructor(
        public location? : string,
        public isAvailable? : boolean,
        public lastUsed? : Date | null,
        public currentUserUID? : string,
        public lastComment? : Date | null,
        public comments? : number,
        public lastPayment? : Date | null,
    ){}
}

export const getMatrix = () => {
    return [
        [new Space('A-1', true), new Space('A-2', false), new Space('A-3', true), new Space('A-4', false), new Space('A-5', true), new Space('A-6', false)],
        [new Space('B-1', true), new Space('B-2', true), new Space('B-3', false), new Space('B-4', true), new Space('B-5', false), new Space('B-6', true)],
        [new Space('C-1', true), new Space('C-2', true), new Space('C-3', true), new Space('C-4', false), new Space('C-5', true), new Space('C-6', false)],
        [new Space('D-1', false), new Space('D-2', true), new Space('D-3', true), new Space('D-4', true), new Space('D-5', false), new Space('D-6', true)],
        [new Space('E-1', true), new Space('E-2', true), new Space('E-3', true), new Space('E-4', false), new Space('E-5', true), new Space('E-6', false)],
        [new Space('F-1', false), new Space('F-2', true), new Space('F-3', false), new Space('F-4', true), new Space('F-5', false), new Space('F-6', true)]
    ];
}
