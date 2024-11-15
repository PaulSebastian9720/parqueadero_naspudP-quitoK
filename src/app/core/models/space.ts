
export class SpaceFB {
    constructor(
        public location : string,
        public state : "Y"| "N" | "O"|"NP",
        public idFBCliente : string,
        public idFBManagement: string
    ){}
    
    toJSON() {
        return {
          location: this.location,
          state: this.state,
          idFBCliente: this.idFBCliente,
          idFBManagement: this.idFBManagement,
        };
    }

    static fromJSON(json: any): SpaceFB {
        return new SpaceFB(
            json.location,
            json.state,
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

