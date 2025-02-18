import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Rate } from '../../../../core/interfaces/rate';
import { RateService } from '../../../../shared/services/api/rate/rate.service';

@Component({
  selector: 'app-select-rate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-rate.component.html',
})
export class SelectRateComponent implements OnInit {
  selectRate: string = ''
  listRate: Rate[] = []
  @Input() showSelect: boolean = true
  @Input() showRateInformations: boolean = true
  @Input() rateSelect : Rate = {}
  @Input() filterMonths : boolean = true
  @Output() eventRate = new EventEmitter<Rate>()

  constructor(private rateService: RateService) {}

  ngOnInit(){
    this.initRates()
  }
  initRates(){
    this.rateService.getAllRates().subscribe(rates => { 
      if(this.filterMonths){
        this.listRate = rates.filter(rate => rate.timeUnit === '1_month')
      } else {
        this.listRate = rates.filter(rate => rate.timeUnit !== '1_month')

      }
   })
  }

  onClickRate(): void {
    if (!this.selectRate) {
      return
    }
    const rateData = {...this.listRate.find(value => value.idRate?.toString() === this.selectRate)}
    this.rateSelect = rateData
    this.eventRate.emit(rateData)   
  }

  clearCamps(){
    this.selectRate = ''
    this.rateSelect = {}  
  }
}

