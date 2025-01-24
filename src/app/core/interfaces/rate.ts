export interface Rate {
  idRate?: number;
  name?: string;
  prize: number;
  timeUnit: '5_minutes' | '10_minutes' | '30_minutes' | '1_hour' | '1_month';
}
