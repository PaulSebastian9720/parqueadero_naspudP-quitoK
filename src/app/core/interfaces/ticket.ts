import { DealBase } from "./dealBase";
import { Rate } from "./rate";

export interface Ticket extends DealBase  {
    tyoe: 'tickect', 
    rates: Rate[];

}