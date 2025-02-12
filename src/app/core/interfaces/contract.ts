import { Automobile } from "../models/automobile";
import { ParkingSpace } from "./parkingSpace";
import { User } from "./person";
import { Rate } from "./rate";

export interface Contract {
  idContract?: number;
  type: 'MT' | 'TM';
  status: 'AC' | 'IN' | 'WT' | 'CL';
  prize?: number;
  startDate: Date;
  endDate?: Date;
  person: User;
  parkingSpace: ParkingSpace;
  rates: Rate[];
  automobile?: Automobile;
}
