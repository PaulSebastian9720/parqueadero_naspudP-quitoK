import { Component, ViewChild } from '@angular/core';
import { HeaderServiceComponent } from "../../../../shared/components/header-service/header-service.component";
import { EditRateComponent } from "../../components/edit-rate/edit-rate.component";
import { ListRatesComponent } from "../../components/list-rates/list-rates.component";
import { RateData } from '../../../../core/models/rate';


@Component({
  selector: 'app-parking-rates',
  standalone: true,
  imports: [HeaderServiceComponent, EditRateComponent, ListRatesComponent],
  templateUrl: './parking-rates.component.html',
})
export class ParkingRatesComponent {
  
  @ViewChild("tableRates") tableRates !: ListRatesComponent
  rateData!: RateData

  updateRates(){
    this.tableRates.initListRates()
  }

  getRateData(rateData: RateData){
    this.rateData = rateData
  }
}
