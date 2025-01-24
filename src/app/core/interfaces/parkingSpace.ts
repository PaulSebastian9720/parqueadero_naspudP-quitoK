import { Contract } from "./contract";

export interface ParkingSpace {
  idParkingSpace?: number;
  location: string;
  status: 'FR' | 'BM' | 'BT' | 'IN';
  contract?: Contract;
}
