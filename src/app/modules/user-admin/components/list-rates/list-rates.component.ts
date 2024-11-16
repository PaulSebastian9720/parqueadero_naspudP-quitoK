import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RateData } from '../../../../core/models/rate';
import { RateService } from '../../../../shared/services/rate/rate.service';

@Component({
  selector: 'app-list-rates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-rates.component.html',
})
export class ListRatesComponent implements OnInit {
  
  listRate : RateData [] = []

  constructor(
    private rateServices : RateService
  ) { }
  
  @Output() eventGetRateDate = new EventEmitter<RateData>;

  async ngOnInit(): Promise<void> {
      this.initListRates()
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
}
