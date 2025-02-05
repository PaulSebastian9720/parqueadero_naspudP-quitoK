import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { RateData } from '../../../../core/models/rate';
import { RateService } from '../../../../shared/services/rate/rate.service';
import { DialogService } from '../../../../shared/services/dialog/dialogconfirm.service';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-rates',
  standalone: true,
  imports: [CommonModule,  MatPaginator],
  templateUrl: './list-rates.component.html',
})
export class ListRatesComponent implements OnInit {
  
  listRate : RateData [] = []

  dataSource = new MatTableDataSource(this.listRate);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private rateServices : RateService,
    private dialogService: DialogService,
    private notyfyService: NotificationService

  ) { }
  
  @Output() eventGetRateDate = new EventEmitter<RateData>;

  async ngOnInit(): Promise<void> {
    this.initListRates()
    this.dataSource.paginator = this.paginator;
  }


  getNameSpanish(timeUnit: string, quantity: number): string{
    if(timeUnit === "month"){
      return `${quantity} ${quantity > 1 ? "Meses" : "Mes"}`
    }else if (timeUnit === "days"){
      return  `${quantity} ${quantity > 1 ? "Días" : "Día"}`

    }else if (timeUnit === "hours"){
      return `${quantity} ${quantity > 1 ? "Horas" : "Hora"}`
    }else {
      return `${quantity} ${quantity > 1 ? "Minutos" : "Minuto"}`
    }
  }

  getRateDate(rateData: RateData) {
    this.eventGetRateDate.emit(rateData);
  }

  async initListRates() {
    this.listRate = await this.rateServices.getListRate()
  }

  async onClickDeleteRate(rateData:RateData){
    this.dialogService
      .confirm({
        title: '¡Advertencia!',
        question: '¿Estás seguro de continuar con esta acción?',
        highlight: `Esto eliminará la taria ${rateData.rateFB.name}`,
        icon: 'fas fa-exclamation-circle',
      })
      .then((confirmed) => {
        if (confirmed) {
          this.rateServices.deleteRate(rateData.id)
          this.initListRates()
          this.notyfyService.notify(`Se eliminó una tarifa`, 'error', 3000)
        } else {
          this.notyfyService.notify(`No se elimino la tarifa`, 'info', 4000)

        }
      });
  }
}
