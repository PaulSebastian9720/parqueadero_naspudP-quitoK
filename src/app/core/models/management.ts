import { Automobile } from "./automobile";
import { RateFB } from "./rate";

export class Management {
    constructor(
        public startDate: Date,
        public endDate: Date,
        public totalPrice: number,
        public status: boolean,
        public benefits?: string[],
    ){}
}

export class ManagementFB {
    constructor(
        public type : "M" | "R",
        public fbIDClient: string,
        public startDate: Date,
        public endDate: Date,
        public totalPrice: number,
        public state: "A"| "I" |"W" | "C",
        public uidSpaces: string,
        public rate : RateFB,
        public benefits?: string[],
        public autmobile?: Automobile,
    ){}
   
      
    toJson() {
        return {
        fbIDClient: this.fbIDClient,
        startDate: this.startDate.toISOString(), 
        endDate: this.endDate.toISOString(), 
        totalPrice: this.totalPrice,
        state: this.state,
        uidSpaces: this.uidSpaces,
        benefits: this.benefits || [], 
    }
    }
}
      


export class ManagementData {
    constructor(
        public id : string,
        public managenteFB : ManagementFB
    ){}
}