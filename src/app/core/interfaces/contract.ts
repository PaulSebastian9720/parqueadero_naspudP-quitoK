import { DealBase } from "./dealBase";
import { Rate } from "./rate";

export interface Contract extends DealBase {
  type: 'contract',
  autoRenewal: boolean,
  rate: Rate
}

export interface ReqContract {
  autoRenewal: boolean,
  idRate: number,
  person: {
    idPerson: number,
    documentID: string
  }
  automobile: {
    idAutomobile: number,
    licensePlate: string
  },
  parkingSpace: {
    idParkingSpace: number,
    location: string,
  }
}
