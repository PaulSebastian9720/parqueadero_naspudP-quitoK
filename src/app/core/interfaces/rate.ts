export interface Rate {
  idRate?: number;
  name?: string;
  prize?: number;
  timeUnit?:  '15_minutes' | '30_minutes' | '1_hour' | '1_night'| '1_day'| '1_month';
}
