import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ParkingSpace } from '../../../../../core/interfaces/parkingSpace';
import { ParkingSpaceService } from '../../../../../shared/services/api/parkingSpace/parkingSpace.service';
import { NotificationService } from '../../../../../shared/services/dialog/notificaion.service';

@Component({
  selector: 'app-update-state',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-state.component.html',
})
export class UpdateStateComponent {
  spaceParkingSelect!: ParkingSpace;
  selectRow = '';
  selectSpaceId = '';
  listRowPosibilies: ParkingSpace[] = [];

  // Propiedad de entrada: Mapa de espacios disponibles
  mapSlot: Map<string, ParkingSpace[]> = new Map<string, ParkingSpace[]>();
  @Input() length: number = 0;
  // Evento de salida para emitir el espacio seleccionado
  @Output() sendSlot = new EventEmitter<void>();

  constructor(
    private parkisSService: ParkingSpaceService,
    private notificacioService: NotificationService
  ) {}

  filterListDisable() {
    this.parkisSService.getFilterList('IN').subscribe((list) => {
      if (list) {
        list.forEach((space) => {
          const key = space.location!.split('-')[0];
          if (!this.mapSlot.has(key)) {
            this.mapSlot.set(key, []);
          }
          this.mapSlot.get(key)!.push(space);
        });
      }
    });
  }
  filterListEnable() {
    this.parkisSService.getFilterList('FR').subscribe((list) => {
      if (list) {
        list.forEach((space) => {
          const key = space.location!.split('-')[0];
          if (!this.mapSlot.has(key)) {
            this.mapSlot.set(key, []);
          }
          this.mapSlot.get(key)!.push(space);
        });
      }
    });
  }

  // Convierte un índice numérico en una letra (por ejemplo, 0 -> 'A')
  fromCharCode(index: number) {
    return String.fromCharCode(65 + index);
  }

  // Filtra los espacios de la fila seleccionada
  selectRowList() {
    this.listRowPosibilies = this.mapSlot.get(this.selectRow) ?? [];
  }

  // Selecciona un espacio basado en el ID de la ubicación
  selectSpace() {
    const space = this.listRowPosibilies.find(
      (value) => value.location! === this.selectSpaceId
    );
    this.spaceParkingSelect = { ...space! }; // Asigna el espacio encontrado
  }

  // Emite el espacio seleccionado al componente padre
  onSendData() {
    this.parkisSService
      .updateSpaceStatus(this.spaceParkingSelect.idParkingSpace!)
      .subscribe((response) => {
        if(response){
          this.notificacioService.notify(
            response.message,
            'success',
            2250
          );
          this.sendSlot.emit();
        }
        
      });
  }

  get mapSlotKeys(): string[] {
    return Array.from(this.mapSlot.keys());
  }
}
