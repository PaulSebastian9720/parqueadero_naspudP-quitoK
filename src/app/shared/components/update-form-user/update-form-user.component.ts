import {
Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
} from '@angular/forms';
import {
  isShortParameter,
  isRequired,
  isNumberPhone,
} from '../../../modules/auth/utils/validator';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/dialog/notificaion.service';
import { User, UserForm } from '../../../core/interfaces/person';

@Component({
  selector: 'app-update-form-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-form-user.component.html',
})
export class UpdateFormUserComponent implements OnInit, OnChanges {
  registerForm!: FormGroup;

  @Input() showOptionals: boolean = true;
  @Input() messageButton = "Actualizar"
  @Input() user: User = {};
  @Input() isEditingMail = true
  @Input() isEditing: boolean = false;
  @Output() sendUser = new EventEmitter<User>();

  constructor(
    private form: FormBuilder, // Servicio para construir formularios reactivos
    private notiticationService: NotificationService // Servicio para mostrar notificaciones
  ) {}

  /**
   * Método que se ejecuta cuando las entradas cambian.
   * Detecta cambios en 'userData' o 'isEditing' y actualiza el formulario en consecuencia.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.registerForm) return;
    if (changes['user'] && changes['user'].currentValue) {
      this.uploadForm(); 
    }
    if (changes['isEditing']) {
      this.uploadForm();
    }
  }

  /**
   * Método que se ejecuta cuando el componente se inicializa.
   * Aquí se inicializa el formulario reactivo y se carga la información del usuario si se pasa 'userData'.
   */
  ngOnInit(): void {
    this.registerForm = this.form.group<UserForm>({
      name: this.form.control('', Validators.required),
      lastName: this.form.control('', Validators.required),
      mail: this.form.control('', [Validators.required, Validators.email]),
      mailS: this.form.control('', [Validators.email]),
      location: this.form.control(''),
      documentID: this.form.control(''),
      phone: this.form.control(''),
      birthday: this.form.control(''),
    });

    // Si se pasa userData, cargar los datos en el formulario
    if (this.user) {
      this.uploadForm();
    }
  }

  isShortParameter(
    field: 'password' | 'name' | 'last_name' | 'number',
    minLength: number = 3
  ) {
    return isShortParameter(field, this.registerForm, minLength);
  }

  isRequired(field: 'name' | 'password' | 'last_name' | 'correo') {
    return isRequired(field, this.registerForm);
  }
  isNotNumber() {
    return isNumberPhone(this.registerForm);
  }

  /**
   * Método que maneja el evento de envío del formulario.
   * Realiza la validación del formulario, muestra una notificación y realiza la actualización del usuario.
   */
  onSubmit() {
    if (!this.user) return;
    if (this.registerForm.invalid) return;
    if (!this.isEditing) {
      this.notiticationService.notify('No se puede editar', 'warning', 2250);
      return;
    }
    const { name, lastName, birthday, mail, mailS, location, phone, documentID} =
      this.registerForm.value;

    if (
      name.length < 3 ||
      lastName.length < 3 ||
      (phone && phone.length != 10)
    )
      return;
    const user: User = {
      idPerson: this.user.idPerson,
      name: name,
      lastName: lastName,
      mail: mail,
      mailS: mailS,
      location: location,
      phone: phone,
      birthDay: new Date(birthday),
      documentID: documentID,
    };
    this.sendUser.emit(user)

  }

  /**
   * Método que carga los valores de 'userData' en el formulario.
   * Este método se llama cuando se inicializa el formulario o cuando se recibe un nuevo 'userData'.
   */
  uploadForm() {
    const birthDay = this.user.birthDay ? 
      new Date(this.user.birthDay).toISOString().split('T')[0] 
      : ""

    this.registerForm.patchValue({
      name: this.user.name || '',
      lastName: this.user.lastName || '',
      mail: this.user.mail || '',
      birthday: birthDay,
      phone: this.user.phone || '',
      location  : this.user.location || '',
      mailS: this.user.mailS || '',
      documentID: this.user.documentID || '',
    });
  }
}
