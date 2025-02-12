import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RateService } from '../../../../shared/services/rate/rate.service';
import { RateData} from '../../../../core/models/rate';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-rate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-rate.component.html',
})
export class SelectRateComponent implements OnInit {
  selectRate: string = ''
  
  listRate: RateData[] = []

  listFilter: RateData[] = []

  @Output() eventRate = new EventEmitter<RateData>()

  constructor(private rateService: RateService) {}

  async ngOnInit(): Promise<void> {
    this.initrates()
  }
  async initrates(){
    try {
      const data = await this.rateService.getListRate()
      this.listRate = data
      this.listFilter = this.listRate
        .filter(value => value.rateFB.timeUnit === 'month')
    } catch (error) {}
  }

  onClickRate(): void {
    if (!this.selectRate) {
      return
    }
    const rateData = this.listRate.find(value => value.id === this.selectRate)
    this.eventRate.emit(rateData)   
    this.selectRate = '' 
  }
}

