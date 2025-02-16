import { Contract } from "./contract";

export interface ParkingSpace {
  idParkingSpace?: number;
  location: string;
  status: 'FR' | 'BC' | 'BT' | 'IN';
  contract?: Contract;
}
