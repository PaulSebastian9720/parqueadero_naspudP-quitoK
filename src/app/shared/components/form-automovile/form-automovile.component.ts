import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Automobile } from '../../../core/interfaces/automobile';
import { AutomobileService } from '../../services/api/automovile/automobile.service';
import { NotificationService } from '../../services/dialog/notificaion.service';

@Component({
  selector: 'app-form-automovile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-automovile.component.html',
})
export class FormAutomovileComponent {
  constructor(
    private automobileService: AutomobileService,
    private notifyService: NotificationService
  ) {}

  // Propiedades de entrada y salida del componente
  @Input() automobile: Automobile = {
    idAutomobile: 0,
    licensePlate: '',
    brand: '',
    model: '',
    idPerson: 0,
  };
  @Output() eventUpateUser = new EventEmitter();

  /**
   * Método para limpiar el formulario (restablecer el objeto 'automobile').
   */
  clearForm() {
    this.automobile = {
      idAutomobile: 0,
      licensePlate: '',
      brand: '',
      model: '',
      idPerson: 0,
    };
  }

  /**
   * Método que maneja el envío del formulario.
   * Si el formulario es válido, crea o actualiza un automóvil en la lista del usuario.
   */
  onSubmit() {
    if (
      this.automobile.licensePlate &&
      this.automobile.licensePlate.length < 5
    ) {
      this.notifyService.notify(
        'The plate is required, and needs minimum of 5 characters',
        'error',
        2250,
      );
      return;
    }

    console.log(this.automobile);
    if (this.automobile.idPerson! === 0 && this.automobile.idAutomobile! === 0) {
      this.automobileService.insertAutomobile(this.automobile);
    } else if (
      this.automobile.idPerson! > 0 &&
      this.automobile.idAutomobile! > 0
    ) {
      this.automobileService.updateAutomobile(this.automobile);
    } else {
      this.notifyService.notify(
        'There are problems with this action. Please try again',
        'error',
        22500
      );
      return;
    }
    this.clearForm();
    this.eventUpateUser.emit();
    return;
  }
}
