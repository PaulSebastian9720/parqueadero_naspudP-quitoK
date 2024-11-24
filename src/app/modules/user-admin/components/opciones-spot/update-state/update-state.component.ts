import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ParkinLotService } from '../../../../../shared/services/space/parkink-lot.service';
import { SpaceData } from '../../../../../core/models/space';
import { filter, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-state',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-state.component.html',
})
export class UpdateStateComponent {
  // Variables para manejar el espacio y fila seleccionados
  spaceDataSelect!: SpaceData;  // Espacio seleccionado
  selectRow = 0;  // Fila seleccionada
  selectSpaceId = '';  // ID del espacio seleccionado
  listRows: number[] = [0, 1, 2, 3, 4, 5, 6];  // Lista de filas disponibles
  mapSlotFilter: SpaceData[][] = [];  // Mapa de espacios filtrados por estado
  listRowPosibilies: SpaceData[] = [];  // Espacios posibles para la fila seleccionada

  // Propiedad de entrada: Mapa de espacios disponibles
  @Input() mapSlot!: SpaceData[][];

  // Evento de salida para emitir el espacio seleccionado
  @Output() sendSlot = new EventEmitter<SpaceData>();

  // Convierte un índice numérico en una letra (por ejemplo, 0 -> 'A')
  fromCharCode(index: number) {
    return String.fromCharCode(65 + index);
  }

  // Filtra los espacios habilitados (estado 'Y')
  filterForEnable() {
    if (!this.mapSlot) return;  // Si no hay datos, no hace nada
    this.mapSlot.forEach((row) => {
      const rowData: SpaceData[] = [];
      row.forEach((space) => {
        if (space.spaceFB.state === 'Y') {
          rowData.push(space);  // Añade solo los habilitados
        }
      });
      this.mapSlotFilter.push(rowData);
    });
  }

  // Filtra los espacios deshabilitados (estado 'NP')
  filterForddDisable() {
    if (!this.mapSlot) return;  // Si no hay datos, no hace nada
    this.mapSlot.forEach((row) => {
      const rowData: SpaceData[] = [];
      row.forEach((space) => {
        if (space.spaceFB.state === 'NP') {
          rowData.push(space);  // Añade solo los deshabilitados
        }
      });
      this.mapSlotFilter.push(rowData);
    });
  }

  // Filtra los espacios de la fila seleccionada
  selcetRowList() {
    this.listRowPosibilies = this.mapSlotFilter[this.selectRow];
  }

  // Selecciona un espacio basado en el ID de la ubicación
  selectSpace() {
    const space = this.listRowPosibilies.find(
      (value) => value.spaceFB.location === this.selectSpaceId
    );
    this.spaceDataSelect = { ...space! };  // Asigna el espacio encontrado
  }

  // Emite el espacio seleccionado al componente padre
  onSendData() {
    if (!this.mapSlot || !this.spaceDataSelect) return;  // Verifica que los datos existan
    this.sendSlot.emit(this.spaceDataSelect);  // Emite el espacio seleccionado
  }
}
