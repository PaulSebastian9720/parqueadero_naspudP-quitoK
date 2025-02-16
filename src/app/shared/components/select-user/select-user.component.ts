import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/interfaces/person';
import { UserService } from '../../services/api/user/user.service';

@Component({
  selector: 'app-select-user',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './select-user.component.html',
})
export class SelectUserComponent implements OnInit {
  selectedUser: string = ''; // Variable que guarda el UID del usuario seleccionado
  userSelect: User = {};
  listAllUser: User[] = []; // Lista completa de usuarios obtenida desde el servicio
  wordFilter: string = '';
  showInformation: boolean = true;

  @Output() userEventEmitter = new EventEmitter<User>(); // Emite el usuario seleccionado hacia el componente padre
  @Input() filterList: boolean = false;

  constructor(private userService: UserService) {}

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
   * Método que maneja el evento de hacer clic sobre un usuario.
   * Busca el usuario seleccionado en 'listUserFb' y emite el usuario encontrado.
   */
  onClickUser() {
    const userData = this.listAllUser.find(
      (user) => user.mail === this.selectedUser
    );
    this.userSelect = { ...userData }
    this.wordFilter =  this.userSelect.documentID!
    this.userEventEmitter.emit(userData);
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

  filterListPerWorld() {
    const userFound = this.listAllUser.find(
      (user) => user.documentID === this.wordFilter
    );
    if (userFound) {
      this.userSelect = { ...userFound };
      this.userEventEmitter.emit(userFound);
    } else {
      this.userSelect = {};
      this.userEventEmitter.emit(userFound);
      this.selectedUser = '';
    }
  }
}
