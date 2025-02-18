import { Component, ViewChild } from '@angular/core';
import { MatrixSpacesComponent } from '../../../../shared/components/matrix-spaces/matrix-spaces.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { SelectUserComponent } from '../../../../shared/components/select-user/select-user.component';
import { SelectRateComponent } from '../../components/select-rate/select-rate.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SelectAutomobileComponent } from '../../components/select-automobile/select-automobile.component';
import { User } from '../../../../core/interfaces/person';
import { ParkingSpace } from '../../../../core/interfaces/parkingSpace';
import { Rate } from '../../../../core/interfaces/rate';
import { Automobile } from '../../../../core/interfaces/automobile';
import { ShowParkingspaceComponent } from '../../../../shared/components/show-parkingspace/show-parkingspace.component';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { ContractService } from '../../../../shared/services/api/contract/contract';
import { DialogService } from '../../../../shared/services/dialog/dialogconfirm.service';
import { ReqDealBase } from '../../../../core/interfaces/contract';

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
    ShowParkingspaceComponent,
  ],
  templateUrl: './contract-management.component.html',
})
export class ContractManagementComponent {
  // Propiedades del componente
  userSelect: User = {};
  spaceSelect: ParkingSpace = {};
  rateSelect!: Rate | null; // Tarifa seleccionada o null si no hay ninguna
  automobileSelect!: Automobile | null; // Automóvil seleccionado o null si no hay ninguno
  worldFilter: string = '';
  page: '/contract' | '/ticket' = '/contract';
  isAutoRenewable: boolean = false;

  // Referencias a componentes hijos
  @ViewChild('mapaSpaces') mapa!: MatrixSpacesComponent; // Componente para mostrar el mapa de espacios
  @ViewChild('appSelectUser') appUserSelect!: SelectUserComponent;
  @ViewChild('appSelectRate') appSelectRate!: SelectRateComponent;

  constructor(
    private notificationService: NotificationService,
    private contractService: ContractService,
    private dialogConfirmService: DialogService
  ) {}

  onClickUser(user: User) {
    this.userSelect = user; // Asigna el usuario seleccionado
    this.automobileSelect = {}; // Resetea el automóvil
  }

  onClickRate(rateData: Rate) {
    this.rateSelect = rateData; // Asigna la tarifa seleccionada
  }

  onClinkSpace(space: ParkingSpace) {
    this.spaceSelect = space; // Asigna el espacio seleccionado
  }

  onClinkAutomobile(automobile: Automobile) {
    this.automobileSelect = automobile; // Asigna el automóvil seleccionado
  }

  onClickParkingSpace(parkingSpace: ParkingSpace) {
    this.spaceSelect = parkingSpace;
  }

  updateMap() {
    this.mapa.initParkingLotService(); // Inicializa el servicio del mapa
  }

  onChangeType(page: '/contract' | '/ticket') {
    this.page = page;
    this.rateSelect = null;
  }

  get startDate(): string {
    const today = new Date();
    return today.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  get endDate(): string {
    const today = new Date();
    const nextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    return this.rateSelect
      ? nextMonth.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : '';
  }

  toggleAutoRenew() {
    this.isAutoRenewable = !this.isAutoRenewable;
  }

  onSubmitContract() {
    if (!this.validatosrContract) {
      this.notificationService.notify('All date is requeired', 'warning', 2250);
    }

    const question =
      this.page === '/contract'
        ? `¿Estás seguro de crear el contrato en ${this.spaceSelect.location} para ${this.userSelect?.name} ?`
        : '';
    this.dialogConfirmService
      .confirm({
        title: 'Nueva Reserva en el Parking',
        question: question,
        highlight: 'Confirmar',
        icon: 'fa fa-credit-card',
      })
      .then((confirm) => {
        if (confirm) {
          const reqContact: ReqDealBase = {
            autoRenewal: this.isAutoRenewable,
            idRate: this.rateSelect?.idRate!,
            person: {
              idPerson: this.userSelect?.idPerson!,
              documentID: this.userSelect?.documentID!,
            },
            automobile: {
              idAutomobile: this.automobileSelect?.idAutomobile!,
              licensePlate: this.automobileSelect?.licensePlate!,
            },
            parkingSpace: {
              idParkingSpace: this.spaceSelect.idParkingSpace!,
              location: this.spaceSelect.location!,
            },
          };

          this.contractService.insertContract(reqContact).subscribe(
            (response) => {
              if (response) {
                this.notificationService.notify(
                  response.message,
                  'success',
                  2250
                );
                this.clearnCamps();
                this.updateMap();
              }
            },
            (error) => {
              this.notificationService.notify(error.error, 'error', 2250);
            }
          );
        } else {
          this.notificationService.notify('Contrato cancelado', 'error', 2250);
        }
      });
  }

  tiggerClearCamps(): void {}

  clearnCamps() {
    this.rateSelect = {};
    this.userSelect = {};
    this.spaceSelect = {};
    this.appUserSelect.clearCamps();
    this.appSelectRate.clearCamps();
  }

  get validatosrContract(): boolean {
    if (!this.automobileSelect) return false;
    if (!this.userSelect) return false;
    if (!this.rateSelect) return false;
    if (this.page === '/contract' && !this.rateSelect) return false;
    if (!this.spaceSelect) return false;
    if (this.spaceSelect.status !== 'FR') return false;
    return true;
  }
}
