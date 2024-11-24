import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Automobile } from '../../../core/models/automobile';
import { FormsModule } from '@angular/forms';
import { UserData } from '../../../core/models/user';
import { CommonModule } from '@angular/common';
import { UserfbService } from '../../services/user/userfb.service';

@Component({
  selector: 'app-form-automovile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-automovile.component.html',
})
export class FormAutomovileComponent {
  constructor(private userService: UserfbService) {}

  // Propiedades de entrada y salida del componente
  @Input() userData!: UserData; // Datos del usuario recibidos como entrada
  @Input() automobileData!: Automobile | null; // Datos del automóvil recibido, puede ser nulo si no se edita un automóvil
  @Output() eventUpateUser = new EventEmitter(); // Evento para notificar la actualización del usuario

  // Objeto de automóvil inicializado con valores vacíos
  automobile: Automobile = new Automobile('', '', '', '');

  /**
   * Método que se ejecuta al inicializar el componente.
   * Si hay datos de automóvil recibidos, los asigna al objeto 'automobile'.
   */
  ngOnInit() {
    if (this.automobileData) {
      this.automobile = { ...this.automobileData }; // Copia los datos del automóvil recibido
    }
  }

  /**
   * Método para limpiar el formulario (restablecer el objeto 'automobile').
   */
  clearForm() {
    this.automobile = new Automobile('', '', '', ''); // Reinicia el objeto 'automobile'
  }

  /**
   * Método que maneja el envío del formulario.
   * Si el formulario es válido, crea o actualiza un automóvil en la lista del usuario.
   */
  async onSubmit() {
    if (!this.userData) {
      return; // Si no hay datos de usuario, no hace nada
    }

    // Validación básica: si no falta modelo, placa o marca
    if (
      !this.automobile.model ||
      !this.automobile.plate ||
      !this.automobile.brand
    ) {
      return; // Si falta alguna información, no hace nada (puedes agregar un mensaje de error aquí si es necesario)
    }

    // Si el automóvil no existe (es decir, se está creando uno nuevo)
    if (!this.automobileData) {
      const userFb = { ...this.userData.user }; // Crea una copia de los datos del usuario
      const idAutomovile = this.userData.user.listAutomobile
        ? this.userData.user.listAutomobile.length.toString()
        : '0'; // Calcula un ID para el nuevo automóvil
      this.automobile.id = idAutomovile; // Asigna el ID al nuevo automóvil

      // Crea el objeto de datos del nuevo automóvil
      const automobileData = {
        id: this.automobile.id,
        model: this.automobile.model,
        plate: this.automobile.plate,
        brand: this.automobile.brand,
      };

      // Agrega el nuevo automóvil a la lista del usuario
      userFb.listAutomobile?.push(automobileData);

      // Actualiza los datos del usuario en el servicio
      await this.userService.updateUser(
        this.userData.crendentialUserUID,
        userFb
      );

      // Emite el evento para notificar que el usuario ha sido actualizado
      this.eventUpateUser.emit();
      return;
    }

    // Si el automóvil ya existe (es decir, se está editando un automóvil existente)
    const userUpdate = { ...this.userData.user };

    // Actualiza el automóvil en la lista del usuario, manteniendo los demás sin cambios
    userUpdate.listAutomobile = userUpdate.listAutomobile!.map((automobile) =>
      automobile.id === this.automobile.id ? { ...this.automobile } : automobile
    );

    // Actualiza los datos del usuario en el servicio
    await this.userService.updateUser(
      this.userData.crendentialUserUID,
      userUpdate
    );

    // Emite el evento para notificar que el usuario ha sido actualizado
    this.eventUpateUser.emit();

    // Limpia el formulario después de actualizar
    this.clearForm();
  }
}
