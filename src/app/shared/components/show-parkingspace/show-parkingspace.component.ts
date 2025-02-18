import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParkingSpace } from '../../../core/interfaces/parkingSpace';

@Component({
  selector: 'app-show-parkingspace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './show-parkingspace.component.html',
})
export class ShowParkingspaceComponent {
  @Input() parkingSpace: ParkingSpace = {};

  get parkingStatus(): string {
    const parkingStatus = this.parkingSpace.status ?? '';
    return parkingStatus === 'FR'
      ? 'Disponible'
      : parkingStatus === 'IN'
      ? 'Incactivo'
      : parkingStatus === 'BC'
      ? 'Ocupado por contrato'
      : parkingStatus === 'BT'
      ? 'Ocupado por ticket'
      : '';
  }
}
