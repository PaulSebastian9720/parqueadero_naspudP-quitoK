export interface MessageMail {
  idMessageMail?: number;
  mailFrom?: string;
  nameFrom?: string;
  mailDestination?: string;
  message?: string;
  header?: string;
  shippingDate?: Date;
  status?: 'RD' | 'NR';
  idPerson?: number;
}
