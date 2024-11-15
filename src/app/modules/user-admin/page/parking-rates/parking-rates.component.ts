import { Component } from '@angular/core';
import { HeaderServiceComponent } from "../../../../shared/components/header-service/header-service.component";
import { EditRateComponent } from "../../components/edit-rate/edit-rate.component";

@Component({
  selector: 'app-parking-rates',
  standalone: true,
  imports: [HeaderServiceComponent, EditRateComponent],
  templateUrl: './parking-rates.component.html',
  styleUrl: './parking-rates.component.scss'
})
export class ParkingRatesComponent {

}
