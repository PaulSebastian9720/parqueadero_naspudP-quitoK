import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/interfaces/person';
import { UserService } from '../../services/api/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateFormUserComponent } from '../update-form-user/update-form-user.component';
import { NotificationService } from '../../services/dialog/notificaion.service';

@Component({
  selector: 'app-select-user',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './select-user.component.html',
})
export class SelectUserComponent implements OnInit {
  selectedUser: string = '';
  listAllUser: User[] = []; // Lista completa de usuarios obtenida desde el servicio
  wordFilter: string = '';
  @Input() showSelectUser: boolean = true;
  @Input() showInformation: boolean = true;
  @Input() userSelect: User = {};
  @Input() filterList: boolean = false;
  @Output() userEventEmitter = new EventEmitter<User>();

  constructor(
    private userService: UserService,
    private matDialogService: MatDialog,
    private notiticationService: NotificationService
  ) {}


  addNewUser() {
    const dialogRef = this.matDialogService.open(UpdateFormUserComponent);
    const instance = dialogRef.componentInstance;
    instance.isEditingMail = true;
    instance.isEditing = true;
    instance.showOptionals = false
    instance.messageButton = 'Registrar';
    instance.sendUser.subscribe((user) => {
      this.userService.insertUser(user).subscribe(
        (response) => {
          if (response) {
            this.initListUsers();
            this.notiticationService.notify(response.message, 'success', 2250);
            this.matDialogService.closeAll()
          }
        },
        (error) => {
          this.notiticationService.notify(error.error, 'error', 2250);
        }
      );
    });
  }

  /**
   * Método que se ejecuta cuando el componente se inicializa.
   * Llama a 'initListUsers' para obtener la lista de usuarios.
   */
  ngOnInit() {
    this.initListUsers();
  }

  toggleInformation() {
    this.showInformation = !this.showInformation;
  }

  /**
   * Método que obtiene la lista de usuarios desde el servicio.
   * Filtra la lista para excluir a los usuarios con rol "CF" y los asigna a 'listUserFBFilter'.
   */
  initListUsers() {
    this.userService.getAllUsers().subscribe((users: User[]) => {
      if (this.filterList) {
        this.listAllUser = users.filter((user) => user.role !== 'CF');
      } else {
        this.listAllUser = users;
      }
    });
  }

  /**
   * Método que maneja el evento de hacer clic sobre un usuario.
   * Busca el usuario seleccionado en 'listUserFb' y emite el usuario encontrado.
   */
  onClickUser() {
    const userData = {
      ...this.listAllUser.find((user) => user.mail === this.selectedUser),
    };

    this.wordFilter = userData.documentID ?? '';
    this.userSelect = userData;
    this.userEventEmitter.emit(userData);
  }

  filterListPerWorld() {
    const userFound = {
      ...this.listAllUser.find((user) => user.documentID === this.wordFilter),
    };

    this.selectedUser = userFound.mail ?? '';
    this.userEventEmitter.emit(userFound);

    this.userSelect = userFound;
  }

  clearCamps() {
    this.wordFilter = '';
    this.selectedUser = '';
    this.userSelect = {};
  }
}
