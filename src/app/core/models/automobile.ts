export class Automobile {
    constructor(
        public id: string,
        public plate: string,
        public brand: string,
        public model: string,
    ) {}


    public static fromJSON(json: any): Automobile {
        return new Automobile(
            json.idAutomobile,
            json.plate,
            json.licensePlate,
            json.model
        );
    }
}


