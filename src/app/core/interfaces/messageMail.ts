import { User } from './person';

export interface MessageMail {
  idMessageMail?: number;
  mailFrom?: string;
  nameFrom?: string;
  mailDestination?: string;
  header?: string;
  shippingDate?: Date;
  status?: 'RD' | 'NR';
  person?: User;

  getPersonId?(): number | null;
  setPersonId?(personId: number | null): void;
}
