import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { isShortParameter, isRequired, isNumberPhone } from '../../../modules/auth/utils/validator';
import { UserfbService } from '../../services/user/userfb.service';
import { CommonModule } from '@angular/common';
import { UserData, UserFB } from '../../../core/models/user';
import { NotificationService } from '../../services/dialog/notificaion.service';



@Component({
  selector: 'app-update-form-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-form-user.component.html',
})


export class UpdateFormUserComponent implements OnInit, OnChanges {
  registerForm!: FormGroup;

  @Input() userData!: UserData;  // Datos del usuario que se recibirán desde el componente padre
  @Input() isEditing = false;    // Bandera que indica si se está editando un usuario
  @Output() updateTable = new EventEmitter<void>();  // Emite un evento para actualizar la tabla después de un cambio

  constructor(
    private form: FormBuilder,  // Servicio para construir formularios reactivos
    private userService: UserfbService,  // Servicio para interactuar con los datos de usuarios en Firestore
    private notiticationService: NotificationService  // Servicio para mostrar notificaciones
  ) {}

  /**
   * Método que se ejecuta cuando las entradas cambian.
   * Detecta cambios en 'userData' o 'isEditing' y actualiza el formulario en consecuencia.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.registerForm) return;
    if (changes['userData'] && changes['userData'].currentValue) {
      this.uploadForm();  // Cargar los datos del formulario si 'userData' cambia
    }
    if (changes['isEditing']) {
      this.uploadForm();  // Cargar el formulario si 'isEditing' cambia
    }
  }

  /**
   * Método que se ejecuta cuando el componente se inicializa.
   * Aquí se inicializa el formulario reactivo y se carga la información del usuario si se pasa 'userData'.
   */
  ngOnInit(): void {
    this.registerForm = this.form.group({
      name: this.form.control('', Validators.required),
      last_name: this.form.control('', Validators.required),
      correo: this.form.control('', [
        Validators.required,
        Validators.email,
      ]), 
      correoS: this.form.control('', [
        Validators.email,
      ]), 
      direction: this.form.control(''), 
      city: this.form.control(''),
      phone: this.form.control(''),
      birthday: this.form.control('')
    });

    // Si se pasa userData, cargar los datos en el formulario
    if (this.userData) {
      this.uploadForm();
    }
  }

  /**
   * Método para validar si un campo tiene una longitud mínima especificada.
   * @param field: El campo que se está validando.
   * @param minLength: La longitud mínima permitida.
   */
  isShortParameter(field: "password" | "name" | "last_name" | "number", minLength: number = 3) {
    return isShortParameter(field, this.registerForm, minLength);
  }

  /**
   * Método para verificar si un campo es obligatorio.
   * @param field: El campo que se está validando.
   */
  isRequired(field: "name" | "password" | "last_name" | "correo") {
    return isRequired(field, this.registerForm);
  }

  /**
   * Método para verificar si el campo 'phone' contiene un valor no numérico.
   */
  isNotNumber() {
    return isNumberPhone(this.registerForm);
  }

  /**
   * Método que maneja el evento de envío del formulario.
   * Realiza la validación del formulario, muestra una notificación y realiza la actualización del usuario.
   */
  async onSubmit() {
    if (!this.userData) return;
    
    if (this.registerForm.invalid) return;

    if (!this.isEditing) {
      this.notiticationService.notify("No se puede editar", 'warning', 3000);
      return;
    }
    
    const { name, last_name, birthday, correoS, direction, city, phone } = this.registerForm.value;    
    
    // Validación de datos mínimos
    if (name.length < 3 || last_name.length < 3 || (phone && phone.length != 10)) return;

    try {
      const userData: UserFB = {
        name: name,
        last_name: last_name,
        correo: this.userData.user.correo,
        rol: this.userData.user.rol, 
        state: this.userData.user.state,
        birthDay: new Date(birthday) || "",
        city: city || "",
        phone: phone || "",
        direction: direction || "",
        correoS: correoS || "",
      };

      await this.userService.updateUser(this.userData.crendentialUserUID, userData);
      this.notiticationService.notify("Se actualizado correctamente", 'success', 3000);

      this.updateTable.emit();  // Emite un evento para actualizar la tabla
    } catch (error) {
      // Manejo de errores si ocurre algún fallo
    }
  }

  /**
   * Método que carga los valores de 'userData' en el formulario.
   * Este método se llama cuando se inicializa el formulario o cuando se recibe un nuevo 'userData'.
   */
  uploadForm() {
    const datebirthDay = this.userData.user.birthDay ? 
      new Date((this.userData.user.birthDay as any).seconds * 1000).toISOString().split('T')[0]   
      : ""; 

    this.registerForm.patchValue({
      name: this.userData.user.name || '',
      last_name: this.userData.user.last_name || '',
      correo: this.userData.user.correo || '',
      birthday: datebirthDay,
      phone: this.userData.user.phone || "",
      direction: this.userData.user.direction || "",
      city: this.userData.user.city || "",
      correoS: this.userData.user.correoS || "",
    });
  }
}
