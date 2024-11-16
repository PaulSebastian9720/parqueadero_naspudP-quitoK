import { Component } from '@angular/core';
import { HeaderServiceComponent } from "../../../../shared/components/header-service/header-service.component";
import { EditRateComponent } from "../../components/edit-rate/edit-rate.component";
import { ListRatesComponent } from "../../components/list-rates/list-rates.component";


@Component({
  selector: 'app-parking-rates',
  standalone: true,
  imports: [HeaderServiceComponent, EditRateComponent, ListRatesComponent],
  templateUrl: './parking-rates.component.html',
})
export class ParkingRatesComponent {
  

}
