import { Person } from './person';

export interface MessageMail {
  idMessageMail?: number;
  mailFrom?: string;
  nameFrom?: string;
  mailDestination?: string;
  header?: string;
  shippingDate?: Date;
  status?: 'RD' | 'NR';
  person?: Person;

  getPersonId?(): number | null;
  setPersonId?(personId: number | null): void;
}
