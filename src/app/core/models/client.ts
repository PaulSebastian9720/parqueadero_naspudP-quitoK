import { Automobile } from "./automobile";
import { UserData} from "./user"

export class Client {
    constructor(
        public userData: UserData,
        public listAutomobile?: Automobile [],
        public listManagement?: []
    ) {}
    
}

export class ClientFB {
    constructor(
        public fbUIUser: string,
        public fbUIManagementList?: string [],
        public listAutomobile?: Automobile [],
    ){}
}
