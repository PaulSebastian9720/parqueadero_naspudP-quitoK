import { Client } from "./client";

export class Management {
    constructor(
        public client: Client,
        public startDate: Date,
        public endDate: Date,
        public totalPrice: number,
        public status: boolean,
        public benefits?: string[],
    ){}
}

export class ManagementFB {
    constructor(
        public fbIDClient: string,
        public startDate: Date,
        public endDate: Date,
        public totalPrice: number,
        public status: boolean,
        public uidSpaces: string,
        public benefits?: string[],
    ){}
   
      
    toJson() {
        return {
        fbIDClient: this.fbIDClient,
        startDate: this.startDate.toISOString(), 
        endDate: this.endDate.toISOString(), 
        totalPrice: this.totalPrice,
        status: this.status,
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