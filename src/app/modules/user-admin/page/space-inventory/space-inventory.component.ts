import { Component, ViewChild } from '@angular/core';
import { MatrixSpacesComponent } from '../../../../shared/components/matrix-spaces/matrix-spaces.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { AddSpotComponent } from '../../components/opciones-spot/add-spot/add-spot.component';
import { ParkingSpaceService } from '../../../../shared/services/api/parkingSpace/parkingSpace.service';
import { UpdateStateComponent } from '../../components/opciones-spot/update-state/update-state.component';
import { ParkingSpace } from '../../../../core/interfaces/parkingSpace';
import { SelectUserComponent } from '../../../../shared/components/select-user/select-user.component';
import { User } from '../../../../core/interfaces/person';
import { SelectAutomobileComponent } from '../../components/select-automobile/select-automobile.component';
import { Automobile } from '../../../../core/interfaces/automobile';
import { SelectRateComponent } from '../../components/select-rate/select-rate.component';
import { Rate } from '../../../../core/interfaces/rate';
import { ShowParkingspaceComponent } from '../../../../shared/components/show-parkingspace/show-parkingspace.component';
import { ShowDealBaseComponent } from '../../../../shared/components/show-deal-base/show-deal-base.component';
import { DealBase } from '../../../../core/interfaces/dealBase';
import { ContractService } from '../../../../shared/services/api/contract/contract';
import { UserService } from '../../../../shared/services/api/user/user.service';
import { DialogService } from '../../../../shared/services/dialog/dialogconfirm.service';

@Component({
  selector: 'app-space-inventory',
  standalone: true,
  imports: [
    MatrixSpacesComponent,
    FormsModule,
    CommonModule,
    CommonModule,
    SelectUserComponent,
    SelectAutomobileComponent,
    SelectRateComponent,
    ShowParkingspaceComponent,
    ShowDealBaseComponent,
  ],
  templateUrl: './space-inventory.component.html',
})
export class SpaceInventoryComponent {
  wordFilter = '';
  selectWorld: 'FR' | 'BC' | 'BT' | 'IN' | '' = '';
  userSelect: User = {};
  automobileSelect: Automobile = {};
  rates: Rate[] = [{}];
  showSelectRateTickets: boolean = false;
  parkingSpace: ParkingSpace = {};
  dealBase: DealBase = {};

  @ViewChild('parkingLot') parkingLot!: MatrixSpacesComponent; // Referencia al componente de la matriz de espacios de estacionamiento

  constructor(
    private parkingSService: ParkingSpaceService, // Servicio para manejar las operaciones de estacionamiento
    private dialog: MatDialog, // Servicio para abrir diálogos
    private notyfyService: NotificationService, // Servicio para mostrar notificaciones
    private contractService: ContractService,
    private userService: UserService,
    private dialgoConfirm: DialogService
  ) {}

  /**
   * Método para recargar la matriz de espacios de estacionamiento.
   * Llama al método 'initParkingLotService' del componente 'parkingLot' para recargar los datos de los espacios.
   */
  reloadParkingLot() {
    this.parkingLot.initParkingLotService(); // Recarga la matriz de espacios de estacionamiento
  }

  /**
   * Método para editar un espacio seleccionado.
   * Asigna el espacio pasado como parámetro a la propiedad 'spaceData'.
   * @param spaceData - Los datos del espacio a editar.
   */
  editSpot(parkingSpace: ParkingSpace): void {
    this.parkingSpace = parkingSpace;
    this.showSelectRateTickets = false;
    this.rates = [{}];
    const dealBaseId = this.parkingSpace.idDealBase ?? 0;
    if (dealBaseId > 0) {
      this.contractService
        .getOneContractById(dealBaseId)
        .subscribe((dealBase) => {
          if (dealBase) {
            this.userService
              .getOneUserById(dealBase.idPerson!)
              .subscribe((userSearch) => {
                if (userSearch) {
                  this.userSelect = userSearch;
                }
              });
            this.dealBase = dealBase;
            this.automobileSelect = dealBase.automobile!;
            this.dealBase = dealBase;
            if ('rate' in dealBase) {
              this.rates = [dealBase.rate];
            }
            if ('rates' in dealBase) {
              this.rates = dealBase.rates as Rate[];
            }
          }
        });
    } else {
      this.userSelect = {};
      this.automobileSelect = {};
      this.dealBase = {};
      this.rates = [{}];
    }
  }

  /**
   * Método para agregar un nuevo espacio.
   * Abre un diálogo donde se ingresa una letra de fila, la cual es utilizada para agregar un nuevo espacio.
   */
  addSpot() {
    const dialogRef = this.dialog.open(AddSpotComponent);
    const instance = dialogRef.componentInstance;
    instance.length = this.parkingLot.matrizSpaces.length;
    instance.sendLetterRow.subscribe((data) => {
      if (data.row !== '' && data.length > 0) {
        const dataNewSpot = {
          location: `SPOT_${data.row}`,
          length: data.length,
        };
        this.parkingSService.insertSpace(dataNewSpot).subscribe(
          (response) => {
            this.reloadParkingLot();
            this.dialog.closeAll();
            this.notyfyService.notify(response.message, 'info', 2250);
          },
          (error) => {
            this.notyfyService.notify(error.error, 'error', 2250);
          }
        );
      }
    });
  }

  /**
   * Método para deshabilitar un espacio de estacionamiento.
   * Abre un diálogo para seleccionar un espacio, y si el estado es 'NP', lo cambia a 'Y'.
   */
  onDisable() {
    const dialogRef = this.dialog.open(UpdateStateComponent);
    const instance = dialogRef.componentInstance;

    instance.filterListDisable();
    instance.sendSlot.subscribe(() => {
      this.reloadParkingLot();
      this.dialog.closeAll();
    });
  }

  /**
   * Método para habilitar un espacio de estacionamiento.
   * Abre un diálogo para seleccionar un espacio, y si el estado es 'Y', lo cambia a 'NP'.
   */
  onEnable() {
    const dialogRef = this.dialog.open(UpdateStateComponent);
    const instance = dialogRef.componentInstance;

    instance.filterListEnable();
    instance.sendSlot.subscribe(() => {
      this.reloadParkingLot();
      this.dialog.closeAll();
    });
  }

  filterListPerWorld() {
    this.parkingLot.filterPerWorld(this.selectWorld, this.wordFilter);
  }

  onSubmit() {
    if (this.dealBase.status !== 'AC') {
      this.notyfyService.notify(
        'Solo puede finalizar un contrato activo',
        'warning',
        2250
      );
      return;
    }
    const idDealBase = this.dealBase.idDeal ?? 0;
    if (idDealBase < 0) return;

    this.dialgoConfirm
      .confirm({
        title: 'Confirmar acción',
        question: '¿Segura de Finalizar el contrato?',
        highlight: 'Finalización',
        icon: 'fa fa-question-circle',
      })
      .then((confirm) => {
        if (confirm) {
          this.contractService
            .updateEndContract(idDealBase)
            .subscribe((data) => {
              this.notyfyService.notify(data.message, 'info', 2250);
              this.clearCamps();
              this.reloadParkingLot();
            });
        }
      });
  }

  onDisableContract() {
    if (this.dealBase.status !== 'AC') {
      this.notyfyService.notify(
        'Solo puede finalizar un contrato activo',
        'warning',
        2250
      );
      return;
    }
    const idDealBase = this.dealBase.idDeal ?? 0;
    if (idDealBase < 0) return;

    this.dialgoConfirm
      .confirm({
        title: 'Confirmar acción',
        question: '¿Segura de Cancelar el contrato?',
        highlight: 'Finalización',
        icon: 'fa fa-question-circle',
      })
      .then((confirmed) => {
        if (confirmed) {
          this.contractService
            .updateCancelContract
            (idDealBase)
            .subscribe((data) => {
              this.notyfyService.notify(data.message, 'info', 2250);
              this.clearCamps();
              this.reloadParkingLot();
            });
        }
      });
  }

  clearCamps() {
    this.userSelect = {};
    this.automobileSelect = {};
    this.dealBase = {};
    this.rates = [];
    this.parkingSpace = {};
    this.dealBase = {};
  }


  reciveRate(rateRecive: Rate){
    const rateFound = this.rates.find((rate)=> rate.idRate ==rateRecive.idRate);
    if(rateFound) {
      this.notyfyService.notify(
        'Ya tienes este rate agregado',
        'warning',
        2250
      )
      return
    }
    this.rates.push(rateRecive);

  }
}
