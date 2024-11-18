export class CommentFB {
    constructor(
        public id: string,
        public nombre: string,
        public correo: string,
        public text: string,
    ){}
}

export class CommentData {
    constructor(
        public id: string,
        public commentFB: CommentFB
    ){}

}