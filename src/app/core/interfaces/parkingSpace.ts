
export interface ParkingSpace {
  idParkingSpace?: number;
  location?: string;
  status?: 'FR' | 'BC' | 'BT' | 'IN';
  idDealBase?: number;
  licensePlate?:string;
  documentID?:string;

}
