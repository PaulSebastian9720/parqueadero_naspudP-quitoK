import { Component } from '@angular/core';
import { HeaderServiceComponent } from "../../../../shared/components/header-service/header-service.component";
import { RateData } from '../../../../core/models/rate';
import { RateService } from '../../../../shared/services/rate/rate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pay-parking',
  standalone: true,
  imports: [HeaderServiceComponent, CommonModule],
  templateUrl: './pay-parking.component.html'
})
export class PayParkingComponent {

  listRate : RateData [] = []
  listFilter : RateData [] = []

  constructor(
    private rateServices : RateService
  ) { }

  async ngOnInit(): Promise<void> {
      this.initListRates()
  }

  async initListRates() {
    this.listRate = await this.rateServices.getListRate()
    this.listFilter = this.listRate
      .filter(value => value.rateFB.timeUnit != 'month')
  }



}
