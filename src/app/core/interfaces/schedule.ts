export interface Schedule {
  idDay?: number;
  status: 'R' | 'E' | 'NW';
  dayName?: string;
  openingTime?: Date;
  closingTime?: Date;
}
