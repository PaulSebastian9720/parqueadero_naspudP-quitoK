import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RateService } from '../../../../shared/services/api/rate/rate.service';
import { Rate } from '../../../../core/interfaces/rate';
import { MatDialog } from '@angular/material/dialog';
import { EditRateComponent } from '../edit-rate/edit-rate.component';

@Component({
  selector: 'app-list-rates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-rates.component.html',
})
export class ListRatesComponent implements OnInit {
  listRate: Rate[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() eventGetRateDate = new EventEmitter<Rate>();

  constructor(
    private ratesService: RateService,
    private notyfyService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initListRates();
  }

  getNameSpanish(
    timeUnit: string | undefined,
    quantity: number | undefined
  ): string {
    if (!timeUnit || quantity === undefined) {
      return 'Valor no disponible'; // O un valor predeterminado que desees mostrar
    }

    switch (timeUnit) {
      case 'month':
        return `${quantity} ${quantity > 1 ? 'Meses' : 'Mes'}`;
      case 'days':
        return `${quantity} ${quantity > 1 ? 'Días' : 'Día'}`;
      case 'hours':
        return `${quantity} ${quantity > 1 ? 'Horas' : 'Hora'}`;
      default:
        return `${quantity} ${quantity > 1 ? 'Minutos' : 'Minuto'}`;
    }
  }

  getRateDate(rateData: Rate) {
    const dialogRef = this.dialog.open(EditRateComponent); 
    const instance = dialogRef.componentInstance;
    instance.rateData = rateData; 
    instance.eventUpdateRates.subscribe(() => {
      this.dialog.closeAll();
      this.initListRates();
    });
  }

  initListRates() {
    this.ratesService.getAllRates().subscribe(
      (rates) => {
        this.listRate = rates;
      },
      (error) => {
        console.error('Error al obtener las tarifas:', error);
      }
    );
  }
}
