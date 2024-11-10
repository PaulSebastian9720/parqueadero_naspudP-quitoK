export class Automobile {
    constructor(
        public id: string,
        public plate: string,
        public brand: string,
        public model: string,
    ) {}

    static fromJSON(json: any): Automobile {
        return new Automobile(
            json.id,
            json.plate,
            json.brand,
            json.model,
        );
    }
}


