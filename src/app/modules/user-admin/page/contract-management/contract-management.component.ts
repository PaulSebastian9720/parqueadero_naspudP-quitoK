import { Component, ViewChild } from '@angular/core';
import { MatrixSpacesComponent } from '../../../../shared/components/matrix-spaces/matrix-spaces.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { SelectUserComponent } from '../../../../shared/components/select-user/select-user.component';
import { SelectRateComponent } from '../../components/select-rate/select-rate.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SelectAutomobileComponent } from "../../components/select-automobile/select-automobile.component";
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { User } from '../../../../core/interfaces/person';
import { ParkingSpace } from '../../../../core/interfaces/parkingSpace';
import { Rate } from '../../../../core/interfaces/rate';
import { Automobile } from '../../../../core/interfaces/automobile';


@Component({
  selector: 'app-contract-management',
  standalone: true,
  imports: [
    MatrixSpacesComponent,
    CommonModule,
    FormsModule,
    SelectUserComponent,
    SelectRateComponent,
    MatToolbarModule,
    SelectAutomobileComponent,
],
  templateUrl: './contract-management.component.html',
})
export class ContractManagementComponent {
  
  // Propiedades del componente
  userSelect!: User | null;  
  spaceSelect!: ParkingSpace | null;  // Espacio seleccionado o null si no hay ninguno
  rateSelect!: Rate | null;  // Tarifa seleccionada o null si no hay ninguna
  automobileSelect!: Automobile | null;  // Automóvil seleccionado o null si no hay ninguno
  worldFilter : string = ""
  page : '/contract' | '/ticket' = '/contract'
  

  // Referencias a componentes hijos
  @ViewChild('mapaSpaces') mapa!: MatrixSpacesComponent;  // Componente para mostrar el mapa de espacios

  /**
   * Método para seleccionar la opción 1 o 2 y filtrar los datos correspondientes.
   * Opción 1: Muestra tarifas mensuales y filtra usuarios sin rol "CF".
   * Opción 2: Muestra tarifas que no son mensuales y todos los usuarios.
   */
  selectOption() {
    if (this.page === '/contract') {

      }
    else if (this.page === '/ticket') {
      
    }

    this.rateSelect = null; 
    this.spaceSelect = null;  
  }

  /**
   * Método que se ejecuta cuando se selecciona un usuario.
   * Asigna el usuario seleccionado y resetea el automóvil.
   */
  onClickUser(user: User) {
    this.userSelect = user;  // Asigna el usuario seleccionado
    this.automobileSelect = null;  // Resetea el automóvil
  }

  /**
   * Método que se ejecuta cuando se selecciona una tarifa.
   * Asigna la tarifa seleccionada.
   */
  onClickRate(rateData: Rate) {
    this.rateSelect= rateData;  // Asigna la tarifa seleccionada
  }

  /**
   * Método que se ejecuta cuando se selecciona un espacio.
   * Asigna el espacio seleccionado.
   */
  onClinkSpace(space: ParkingSpace) {
    this.spaceSelect = space;  // Asigna el espacio seleccionado
  }

  /**
   * Método que se ejecuta cuando se selecciona un automóvil.
   * Asigna el automóvil seleccionado.
   */
  onClinkAutomobile(automobile: Automobile) {
    this.automobileSelect = automobile;  // Asigna el automóvil seleccionado
  }

  /**
   * Método para abrir el diálogo para agregar una nueva tarifa.
   * Después de agregar la tarifa, actualiza la lista de tarifas y muestra una notificación de éxito.
   */




  /**
   * Método para actualizar el mapa de espacios.
   * Resetea los datos seleccionados y reinicia el servicio del mapa.
   */
  updateMap() {
    this.userSelect = null;  // Resetea el usuario seleccionado
    this.spaceSelect = null;  // Resetea el espacio seleccionado
    this.mapa.initParkingLotService();  // Inicializa el servicio del mapa
  }


  filterSpace(){

  }

  onChangeType(page: '/contract'  | '/ticket'){
    this.page = page;
    
  }
}
