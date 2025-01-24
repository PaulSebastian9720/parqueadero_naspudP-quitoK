export class MessageMail{
    constructor(
        public mailFrom: string,
        public nameFrom: string,    
        public mailDestination: string,
        public header: string,
        public mesagge : string,
        public shippingDate : Date,
        public status: "rd" | "nr"

    ){}
}