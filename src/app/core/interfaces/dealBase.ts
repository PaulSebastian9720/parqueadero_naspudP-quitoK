import { Automobile } from "./automobile";
import { ParkingSpace } from "./parkingSpace";

export interface DealBase{
    idDeal?: number,
    status?: 'AC' | 'IN' | 'WT' | 'CL',
    finalPrice?: number,
    startDate?: Date,
    endDate?: Date,
    idPerson?: number,
    parkingSpace?: ParkingSpace,
    automobile?: Automobile,
} 