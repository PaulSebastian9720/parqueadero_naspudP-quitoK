import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../shared/services/dialog/notificaion.service';
import { Rate } from '../../../../core/interfaces/rate';
import { RateService } from '../../../../shared/services/api/rate/rate.service';

@Component({
  selector: 'app-edit-rate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-rate.component.html',
})
export class EditRateComponent {
  @Input() rateData: Rate = {}; // Datos de la tarifa recibidos como entrada
  @Output() eventUpdateRates = new EventEmitter<void>(); // Evento para notificar la actualización de las tarifas

  // Inyección de dependencias a través del constructor
  constructor(
    private rateService: RateService,
    private notyfyService: NotificationService // Servicio para mostrar notificaciones
  ) {}

  onSubmit() {
    if (this.rateData.name!.length < 5) {
      this.notyfyService.notify(
        'El nombre de la tarifa debe tener al menos 5 caracteres',
        'error',
        4000
      );
      return;
    }
    if (this.rateData.prize! <= 0) {
      this.notyfyService.notify(
        'El valor de la tarifa debe ser mayor a 0',
        'error',
        4000
      );
      return;
    }

    const rateUpdate = { ...this.rateData };
    this.rateService.updateRate(rateUpdate).subscribe((response) => {
      this.eventUpdateRates.emit();
      this.notyfyService.notify(response.message, 'success', 4000);
    });
  }
}
