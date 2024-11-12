import { Client } from "./client";

export class Space  {
    constructor(
        public location : string,
        public isAvailable : boolean,
        public client? : Client
    ){}
}

export class SpaceFB {
    constructor(
        public location : string,
        public isAvailable : boolean,
        public idFBCliente : string,
        public idFBManagement: string
    ){}
    
    toJSON() {
        return {
          location: this.location,
          isAvailable: this.isAvailable,
          idFBCliente: this.idFBCliente,
          idFBManagement: this.idFBManagement,
        };
    }

    static fromJSON(json: any): SpaceFB {
        return new SpaceFB(
            json.location,
            json.isAvailable,
            json.idFBCliente,
            json.idFBManagement
        )
    }
}

export class SpaceData {
    constructor(
        public id: string,
        public  spaceFB:SpaceFB ,

    ){}
}

