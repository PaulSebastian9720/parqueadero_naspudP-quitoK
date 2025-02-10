import { FormControl } from '@angular/forms';
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
  phone?: string;
  listAutomobiles?: Automobile[];
  listContracts?: Contract[];
  listMessagesMails?: MessageMail[];
}


export interface UserForm {
    name : FormControl<string | null>;
    documentID :FormControl<string | null>
    lastName : FormControl<string | null>;
    mail: FormControl<string | null>;
    mailS : FormControl<string | null>;
    location : FormControl<string | null>;
    birthday  : FormControl<Date | string | null>;
    phone : FormControl<string | null>
}
