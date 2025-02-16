import { Component, OnInit, ViewChild } from '@angular/core';
import { MatrixSpacesComponent } from '../../../../shared/components/matrix-spaces/matrix-spaces.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditSpotComponent } from '../../components/edit-spot/edit-spot.component';
import { SpaceData } from '../../../../core/models/space';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { AddSpotComponent } from '../../components/opciones-spot/add-spot/add-spot.component';
import { ParkingSpaceService } from '../../../../shared/services/api/parkingSpace/parkingSpace.service';
import { UpdateStateComponent } from '../../components/opciones-spot/update-state/update-state.component';

@Component({
  selector: 'app-space-inventory',
  standalone: true,
  imports: [
    MatrixSpacesComponent,
    FormsModule,
    CommonModule,
    EditSpotComponent,
    CommonModule,
  ],
  templateUrl: './space-inventory.component.html',
})
export class SpaceInventoryComponent {
  spaceData!: SpaceData | null; // Datos del espacio seleccionado
  wordFilter = '';
  selectWorld: 'FR' | 'BC' | 'BT' | 'IN' | '' = '';

  @ViewChild('parkingLot') parkingLot!: MatrixSpacesComponent; // Referencia al componente de la matriz de espacios de estacionamiento

  constructor(
    private parkingSService: ParkingSpaceService, // Servicio para manejar las operaciones de estacionamiento
    private dialog: MatDialog, // Servicio para abrir diálogos
    private notyfyService: NotificationService // Servicio para mostrar notificaciones
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
  editSpot(spaceData: SpaceData): void {
    this.spaceData = spaceData; // Establece el espacio seleccionado para editar
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
}
