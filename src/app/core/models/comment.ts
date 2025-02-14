export class Comment {
    constructor(
        public id: number, 
        public name: string, 
        public mail: string, 
        public comment: string
    ) {}

    public static fromJSON(json: any): Comment {
        return new Comment(
            json.idComment,
            json.name,
            json.mail,
            json.comment
        );
    }


}

