import { DealBase } from "./dealBase";
import { Rate } from "./rate";

export interface Ticket extends DealBase  {
    accessTicket: string, 
    rates: Rate[];

}