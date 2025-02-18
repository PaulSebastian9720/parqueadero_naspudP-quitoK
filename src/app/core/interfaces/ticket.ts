import { DealBase } from "./dealBase";
import { Rate } from "./rate";

export interface Tickect extends DealBase  {
    tyoe: 'tickect', 
    rates: Rate[];

}