import { Automobile } from '../models/automobile';
import { MessageMail } from '../models/message';
import { Contract } from './contract';

export interface User {
  idPerson?: number;
  documentID?: string;
  name?: string;
  lastName?: string;
  mail?: string;
  role?: string;
  status?: string;
  birthDay?: Date;
  mailS?: string;
  location?: string;
  listAutomobiles?: Automobile[];
  listContracts?: Contract[];
  listMessagesMails?: MessageMail[];
}
