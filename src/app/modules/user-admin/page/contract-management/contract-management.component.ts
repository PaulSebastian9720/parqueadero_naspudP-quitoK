import { Component, ViewChild } from '@angular/core';
import { HeaderServiceComponent } from '../../../../shared/components/header-service/header-service.component';
import { MatrixSpacesComponent } from '../../../../shared/components/matrix-spaces/matrix-spaces.component';
import { SpaceData } from '../../../../core/models/space';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { CreateContractComponent } from '../../components/create-contract/create-contract.component';
import { UserData } from '../../../../core/models/user';
import { SelectUserComponent } from '../../../../shared/components/select-user/select-user.component';
import { SelectRateComponent } from '../../components/select-rate/select-rate.component';
import { RateData } from '../../../../core/models/rate';
import { MatDialog } from '@angular/material/dialog'; // Importa aquí
import { EditRateComponent } from '../../components/edit-rate/edit-rate.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SelectAutomobileComponent } from "../../components/select-automobile/select-automobile.component";
import { FormAutomovileComponent } from '../../../../shared/components/form-automovile/form-automovile.component';
import { Automobile } from '../../../../core/models/automobile';
import { CreateRentedComponent } from "../../components/create-rented/create-rented.component";
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';


@Component({
  selector: 'app-contract-management',
  standalone: true,
  imports: [
    HeaderServiceComponent,
    MatrixSpacesComponent,
    CommonModule,
    FormsModule,
    CreateContractComponent,
    SelectUserComponent,
    SelectRateComponent,
    MatToolbarModule,
    SelectAutomobileComponent,
    CreateRentedComponent
],
  templateUrl: './contract-management.component.html',
})
export class ContractManagementComponent {
  
  // Propiedades del componente
  userFb!: UserData | null;  // Usuario seleccionado o null si no hay ninguno
  spaceFB!: SpaceData | null;  // Espacio seleccionado o null si no hay ninguno
  rateFb!: RateData | null;  // Tarifa seleccionada o null si no hay ninguna
  isSelected1 = true;  // Bandera para la opción 1 seleccionada
  isSelected2 = false;  // Bandera para la opción 2 seleccionada
  automobile!: Automobile | null;  // Automóvil seleccionado o null si no hay ninguno
  worldFilter : string = ""
  

  // Referencias a componentes hijos
  @ViewChild('mapaSpaces') mapa!: MatrixSpacesComponent;  // Componente para mostrar el mapa de espacios
  @ViewChild('selecttarifa') selectTarifa!: SelectRateComponent;  // Componente para seleccionar tarifas
  @ViewChild('selectUser') selectUser!: SelectUserComponent;  // Componente para seleccionar usuarios
  @ViewChild('selectAutomobile') selectAutomobile!: SelectAutomobileComponent;  // Componente para seleccionar automóviles

  constructor(
    private dialog: MatDialog,  // Servicio de diálogo para abrir componentes modales
    private notyfyService: NotificationService  // Servicio para notificaciones
  ) {}

  /**
   * Método para seleccionar la opción 1 o 2 y filtrar los datos correspondientes.
   * Opción 1: Muestra tarifas mensuales y filtra usuarios sin rol "CF".
   * Opción 2: Muestra tarifas que no son mensuales y todos los usuarios.
   */
  selectOption(option: number) {
    if (option === 1) {
      this.isSelected1 = true;  // Opción 1 seleccionada
      this.isSelected2 = false;  // Opción 2 deseleccionada
      this.selectTarifa.listFilter = this.selectTarifa.listRate.filter(value => value.rateFB.timeUnit === 'month');
      this.selectUser.listUserFBFilter = this.selectUser.listUserFb.filter(value => value.user.rol !== "CF");
      
      if (this.userFb?.user.rol === "CF") {
        this.userFb = null;  // Resetea el usuario seleccionado si es rol "CF"
        this.automobile = null;  // Resetea el automóvil
      }
    } else if (option === 2) {
      this.isSelected1 = false;  // Opción 1 deseleccionada
      this.isSelected2 = true;  // Opción 2 seleccionada
      
      this.selectTarifa.listFilter = this.selectTarifa.listRate.filter(value => value.rateFB.timeUnit !== 'month');
      this.selectUser.listUserFBFilter = this.selectUser.listUserFb;
    }

    this.rateFb = null;  // Resetea la tarifa seleccionada
    this.spaceFB = null;  // Resetea el espacio seleccionado
  }

  /**
   * Método que se ejecuta cuando se selecciona un usuario.
   * Asigna el usuario seleccionado y resetea el automóvil.
   */
  onClickUser(userData: UserData) {
    this.userFb = userData;  // Asigna el usuario seleccionado
    this.automobile = null;  // Resetea el automóvil
  }

  /**
   * Método que se ejecuta cuando se selecciona una tarifa.
   * Asigna la tarifa seleccionada.
   */
  onClickRate(rateData: RateData) {
    this.rateFb = rateData;  // Asigna la tarifa seleccionada
  }

  /**
   * Método que se ejecuta cuando se selecciona un espacio.
   * Asigna el espacio seleccionado.
   */
  onClinkSpace(space: SpaceData) {
    this.spaceFB = space;  // Asigna el espacio seleccionado
  }

  /**
   * Método que se ejecuta cuando se selecciona un automóvil.
   * Asigna el automóvil seleccionado.
   */
  onClinkAutomobile(automobile: Automobile) {
    this.automobile = automobile;  // Asigna el automóvil seleccionado
  }

  /**
   * Método para abrir el diálogo para agregar una nueva tarifa.
   * Después de agregar la tarifa, actualiza la lista de tarifas y muestra una notificación de éxito.
   */
  onAddRate() {
    const dialogRef = this.dialog.open(EditRateComponent);  // Abre el diálogo para agregar tarifa

    const instance = dialogRef.componentInstance;  // Obtiene la instancia del componente modificado

    instance.eventUpdateRates.subscribe(() => {
      this.selectTarifa.initrates();  // Inicializa las tarifas
      this.dialog.closeAll();  // Cierra todos los diálogos
      this.notyfyService.notify('Se agregó una nueva tarifa', 'success', 3000);  // Muestra una notificación de éxito
    });
  }

  /**
   * Método para abrir el diálogo para agregar un nuevo automóvil.
   * Después de agregar el automóvil, actualiza la lista de usuarios y muestra una notificación de éxito.
   */
  onAddAutomovile() {
    if (!this.userFb) return;  // Si no hay un usuario seleccionado, no hace nada
    const dialogRef = this.dialog.open(FormAutomovileComponent);  // Abre el diálogo para agregar automóvil
    const instance = dialogRef.componentInstance;  // Obtiene la instancia del componente modificado
    instance.userData = this.userFb!;  // Pasa los datos del usuario seleccionado
    instance.eventUpateUser.subscribe(() => {
      this.selectUser.initListUsers();  // Inicializa la lista de usuarios
      const userFbAux = this.userFb;  // Guarda el usuario previamente seleccionado
      this.userFb = null;  // Reinicia el usuario seleccionado
      // Busca el usuario en la lista filtrada por su UID y lo asigna de nuevo
      this.userFb = this.selectUser.listUserFb.find(user => user.crendentialUserUID === userFbAux?.crendentialUserUID)!;
      this.dialog.closeAll();  // Cierra todos los diálogos
      this.notyfyService.notify('Agregado un nuevo Automóvil', 'success', 3000);  // Muestra una notificación de éxito
    });
  }

  /**
   * Método para actualizar el mapa de espacios.
   * Resetea los datos seleccionados y reinicia el servicio del mapa.
   */
  updateMap() {
    this.userFb = null;  // Resetea el usuario seleccionado
    this.spaceFB = null;  // Resetea el espacio seleccionado
    this.mapa.initParkingLotService();  // Inicializa el servicio del mapa
  }


  filterSpace(){

  }
}
