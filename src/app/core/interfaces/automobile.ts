import { User } from './person';

export interface Automobile {
  idAutomobile?: number;
  licensePlate?: string;
  brand?: string;
  model?: string;
  person?: User;
  getPersonId?(): number | null;
  setPersonId?(personId: number | null): void;
}
