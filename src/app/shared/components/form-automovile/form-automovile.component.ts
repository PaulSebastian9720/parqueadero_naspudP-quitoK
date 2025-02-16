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
  @Input() automobile: Automobile = {};

  @Output()eventUpateUser = new EventEmitter<void>();

  /**
   * Método para limpiar el formulario (restablecer el objeto 'automobile').
   */
  clearForm() {
    this.automobile = {};
  }

  /**
   * Método que maneja el envío del formulario.
   * Si el formulario es válido, crea o actualiza un automóvil en la lista del usuario.
   */
  onSubmit() {
    const automobileValidates = {...this.automobile }


    const idPerson = automobileValidates.idPerson ?? 0; 
    const idAutomobile = automobileValidates.idAutomobile ?? 0; 
    const licensePlate = automobileValidates.licensePlate || ''; 

    if (idPerson <= 0 && licensePlate.length < 5) {
      this.notifyService.notify(
        'The plate is required, and needs a minimum of 5 characters',
        'error',
        2250
      );
      return;
    }

    if (idAutomobile === 0) {
      const newAutomobile = {...this.automobile}
      newAutomobile.idAutomobile = idAutomobile
      this.automobileService
        .insertAutomobile(newAutomobile)
        .subscribe((response) => {
          
          if (response) {
            this.notifyService.notify(
              'The automobile insert successfully',
              'success',
              2250
            );
            this.clearForm();
            this.eventUpateUser.emit();
            return;
          }
        }, (error)=> {
          this.notifyService.notify(
            'Error al insertar el automóvil. ' + error.error,
            'error',
            2250
          );
          console.error('Error al insertar el automóvil:', error);
        });
    } else if (
      idAutomobile > 0
    ) {
      this.automobileService.updateAutomobile(this.automobile).subscribe(
        (response) => {
          if (response) {
            this.notifyService.notify(response.message, 'success', 2250);
            this.clearForm();
            this.eventUpateUser.emit();
            return;
          }
        },
        (error) => {
          this.notifyService.notify(
            'Error al actualizar los datos del automóvil. ' + error.error,
            'error',
            2250
          );
          console.error('Error al actualizar los datos del automóvil:', error);
        }
      );
    } else {
      this.notifyService.notify(
        'There are problems with this action. Please try again',
        'error',
        2250
      );
      return;
    }
  }

  get accionButton(): string {
    return this.automobile?.idAutomobile && this.automobile.idAutomobile > 0
      ? "Actualizar"
      : "Agregar";
  }
}
