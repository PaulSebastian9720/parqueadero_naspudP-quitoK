import { Person } from './person';

export interface Automobile {
  idAutomobile?: number;
  licensePlate?: string;
  brand?: string;
  model?: string;
  person?: Person;
  getPersonId?(): number | null;
  setPersonId?(personId: number | null): void;
}
