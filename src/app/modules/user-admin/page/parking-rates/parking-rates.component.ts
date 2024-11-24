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
  
  @ViewChild("tableRates") tableRates!: ListRatesComponent;  // Referencia al componente de la tabla de tarifas
  rateData!: RateData;  // Datos de la tarifa seleccionada

  /**
   * Método para actualizar la lista de tarifas.
   * Llama al método 'initListRates' del componente 'tableRates' para actualizar la lista de tarifas.
   */
  updateRates() {
    this.tableRates.initListRates();  // Actualiza la lista de tarifas en la tabla
  }

  /**
   * Método para recibir los datos de una tarifa seleccionada.
   * Asigna los datos de la tarifa seleccionada a la propiedad 'rateData'.
   */
  getRateData(rateData: RateData) {
    this.rateData = rateData;  // Asigna los datos de la tarifa seleccionada
  }
}
