import { Component, OnInit, ViewChild } from '@angular/core';
import { MatrixSpacesComponent } from '../../../../shared/components/matrix-spaces/matrix-spaces.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditSpotComponent } from '../../components/edit-spot/edit-spot.component';
import { SpaceData } from '../../../../core/models/space';
import { ParkinLotService } from '../../../../shared/services/space/parkink-lot.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateStateComponent } from '../../components/opciones-spot/update-state/update-state.component';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';

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
  selectWorld: 'O' | 'Y' | 'N' | '' = '';

  @ViewChild('parkingLot') parkingLot!: MatrixSpacesComponent; // Referencia al componente de la matriz de espacios de estacionamiento

  constructor(
    private parkingLotService: ParkinLotService, // Servicio para manejar las operaciones de estacionamiento
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
    // const dialogRef = this.dialog.open(AddSpotComponent);  // Abre el diálogo para agregar un nuevo espacio
    // const instance = dialogRef.componentInstance;  // Obtiene la instancia del componente de diálogo
    // instance.sendLetterRow.subscribe((letterRow: string) => {
    //   if (letterRow !== "") {
    //     this.parkingLotService.addNewSpot(letterRow!);  // Agrega el nuevo espacio usando la letra de fila
    //     this.reloadParkingLot();  // Recarga la matriz de espacios
    //     this.dialog.closeAll();  // Cierra todos los diálogos
    //     this.notyfyService.notify(`Nuevo Spot en la ROW-${letterRow}`, 'info', 3000);  // Muestra notificación de éxito
    //   }
    // });
    this.notyfyService.notify(
      `Se agrego con nuevo espacio en la Row`,
      'success',
      3000
    ); // Muestra notificación de éxito
  }

  /**
   * Método para deshabilitar un espacio de estacionamiento.
   * Abre un diálogo para seleccionar un espacio, y si el estado es 'NP', lo cambia a 'Y'.
   */
  onDisable() {
    const dialogRef = this.dialog.open(UpdateStateComponent); // Abre el diálogo para actualizar el estado del espacio
    const instance = dialogRef.componentInstance; // Obtiene la instancia del componente de diálogo
    instance.mapSlot = this.parkingLot.matrizSpaces.slice(1, 8); // Establece los espacios a considerar para deshabilitar
    instance.filterForddDisable(); // Filtra los espacios para habilitar la opción de deshabilitar
    instance.sendSlot.subscribe((slot) => {
      if (slot.spaceFB.state === 'NP') {
        const space = { ...slot }; // Crea una copia del espacio
        space.spaceFB.state = 'Y'; // Cambia el estado a 'Y' (habilitado)
        this.parkingLotService.updateParkigSpace(
          space.spaceFB.location,
          space.spaceFB
        ); // Actualiza el espacio
        this.reloadParkingLot(); // Recarga la matriz de espacios
        this.dialog.closeAll(); // Cierra todos los diálogos
        this.notyfyService.notify(
          `Habilitado ${slot.spaceFB.location}`,
          'success',
          3000
        ); // Muestra notificación de éxito
      }
    });
  }

  /**
   * Método para habilitar un espacio de estacionamiento.
   * Abre un diálogo para seleccionar un espacio, y si el estado es 'Y', lo cambia a 'NP'.
   */
  onEnable() {
    const dialogRef = this.dialog.open(UpdateStateComponent); // Abre el diálogo para actualizar el estado del espacio
    const instance = dialogRef.componentInstance; // Obtiene la instancia del componente de diálogo
    instance.mapSlot = this.parkingLot.matrizSpaces.slice(1, 8); // Establece los espacios a considerar para habilitar
    instance.filterForEnable(); // Filtra los espacios para habilitar la opción de habilitar
    instance.sendSlot.subscribe((slot) => {
      if (slot.spaceFB.state === 'Y') {
        const space = { ...slot }; // Crea una copia del espacio
        space.spaceFB.state = 'NP'; // Cambia el estado a 'NP' (no disponible)
        this.parkingLotService.updateParkigSpace(
          space.spaceFB.location,
          space.spaceFB
        ); // Actualiza el espacio
        this.reloadParkingLot(); // Recarga la matriz de espacios
        this.dialog.closeAll(); // Cierra todos los diálogos
        this.notyfyService.notify(
          `Desabilitado ${slot.spaceFB.location}`,
          'warning',
          3000
        ); // Muestra notificación de advertencia
      }
    });
  }

  

  filterListPerWorld() {
    this.parkingLot.filterPerWorld(this.selectWorld, this.wordFilter)
  }
}
